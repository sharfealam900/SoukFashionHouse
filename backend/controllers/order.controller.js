import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import ExcelJS from "exceljs";




export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user._id;

    const {
      shippingAddress,
      paymentMethod,
      couponCode,

      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const fail = (status, message) => {
      const error = new Error(message);
      error.statusCode = status;
      throw error;
    };

    let createdOrder = null;
    let totalAmount = 0;
    let discountAmount = 0;
    let finalAmount = 0;

    await session.withTransaction(async () => {


      if (
        !shippingAddress?.fullName ||
        !shippingAddress?.phone ||
        !shippingAddress?.email ||
        !shippingAddress?.address
      ) {
        fail(400, "Shipping address is required");
      }


      const cart = await Cart.findOne({
        user: userId,
      })
        .populate("items.product")
        .session(session);

      if (!cart || cart.items.length === 0) {
        fail(400, "Cart is empty");
      }



      const validItems = cart.items.filter(
        (item) => item.product
      );

      const invalidItems = cart.items.filter(
        (item) => !item.product
      );

      if (invalidItems.length > 0) {
        cart.items = validItems;
        await cart.save({ session });
      }

      if (validItems.length === 0) {
        fail(
          400,
          "All products in your cart are no longer available."
        );
      }



      let appliedCoupon = null;

      const orderItems = [];

      for (const item of validItems) {
        const product = item.product;



        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          fail(
            400,
            `${product.name}: invalid quantity`
          );
        }



        let selectedSize = null;

        if (product.sizes?.length > 0) {

          selectedSize = product.sizes.find(
            (sizeItem) =>
              Number(sizeItem.size) ===
              Number(item.size)
          );

          if (!selectedSize) {
            fail(
              400,
              `${product.name}: selected size is no longer available`
            );
          }

          if (selectedSize.stock <= 0) {
            fail(
              400,
              `${product.name}: size ${selectedSize.size} is out of stock`
            );
          }

          if (quantity > selectedSize.stock) {
            fail(
              400,
              `${product.name}: only ${selectedSize.stock} item(s) available in size ${selectedSize.size}`
            );
          }

        } else {



          if (product.stock < quantity) {
            fail(
              400,
              `${product.name} is out of stock`
            );
          }
        }



        const productDiscount =
          Number(product.discount || 0);

        const price =
          product.price -
          (product.price * productDiscount) / 100;

        totalAmount += price * quantity;

        orderItems.push({
          product: product._id,
          quantity,
          size:
            item.size !== undefined &&
              item.size !== null &&
              item.size !== ""
              ? Number(item.size)
              : null,
          color: item.color || "",
          price,
        });
      }

  

      if (couponCode) {

        const normalizedCouponCode =
          String(couponCode)
            .trim()
            .toUpperCase();

        const coupon = await Coupon.findOne({
          code: normalizedCouponCode,
        }).session(session);

        if (!coupon) {
          fail(400, "Invalid coupon.");
        }

        if (!coupon.isActive) {
          fail(400, "Coupon is inactive.");
        }

        if (
          coupon.expiresAt &&
          coupon.expiresAt < new Date()
        ) {
          fail(400, "Coupon has expired.");
        }

        if (
          coupon.usedCount >= coupon.usageLimit
        ) {
          fail(
            400,
            "Coupon usage limit exceeded."
          );
        }

        if (
          totalAmount <
          coupon.minimumOrderAmount
        ) {
          fail(
            400,
            `Minimum order amount is ₹${coupon.minimumOrderAmount}`
          );
        }

        if (coupon.discountType === "percentage") {

          discountAmount =
            (totalAmount *
              coupon.discountValue) /
            100;

          if (coupon.maximumDiscount) {
            discountAmount = Math.min(
              discountAmount,
              coupon.maximumDiscount
            );
          }

        } else {

          discountAmount =
            coupon.discountValue;
        }

        // Never allow discount above subtotal
        discountAmount = Math.min(
          discountAmount,
          totalAmount
        );

        appliedCoupon = coupon;
      }



      finalAmount = Math.max(
        totalAmount - discountAmount,
        0
      );


      if (
        discountAmount > 0 &&
        totalAmount > 0
      ) {
        const ratio =
          finalAmount / totalAmount;

        orderItems.forEach((item) => {
          item.price = Number(
            (item.price * ratio).toFixed(2)
          );
        });
      }



      for (const item of validItems) {

        const product = await Product.findById(
          item.product._id
        ).session(session);

        if (!product) {
          fail(
            400,
            "A product in your cart is no longer available."
          );
        }

        const quantity = Number(item.quantity);

        // -------------------------------------------------------
        // Product with sizes
        // -------------------------------------------------------

        if (product.sizes?.length > 0) {

          const sizeItem = product.sizes.find(
            (size) =>
              Number(size.size) ===
              Number(item.size)
          );

          if (!sizeItem) {
            fail(
              400,
              `${product.name}: selected size is no longer available`
            );
          }

          if (sizeItem.stock < quantity) {
            fail(
              400,
              `${product.name}: insufficient stock for size ${sizeItem.size}`
            );
          }

          sizeItem.stock -= quantity;

          // Keep total stock synchronized
          product.stock =
            product.sizes.reduce(
              (total, size) =>
                total +
                Number(size.stock || 0),
              0
            );

        } else {

          // -----------------------------------------------------
          // Product without sizes
          // -----------------------------------------------------

          if (product.stock < quantity) {
            fail(
              400,
              `${product.name}: insufficient stock`
            );
          }

          product.stock -= quantity;
        }

        await product.save({ session });
      }

 

      createdOrder = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,

            // ==============================
            // PAYMENT STATUS
            // ==============================
            paymentStatus:
              paymentMethod === "RAZORPAY"
                ? "Paid"
                : "Pending",

            // ==============================
            // RAZORPAY DETAILS
            // ==============================
            razorpayOrderId:
              razorpayOrderId || "",

            razorpayPaymentId:
              razorpayPaymentId || "",

            razorpaySignature:
              razorpaySignature || "",

            // ==============================
            // ORDER STATUS
            // ==============================
            orderStatus:
              paymentMethod === "RAZORPAY"
                ? "Confirmed"
                : "Pending",

            totalAmount,
            discountAmount,
            finalAmount,

            coupon: appliedCoupon
              ? appliedCoupon._id
              : null,

            couponCode: appliedCoupon
              ? appliedCoupon.code
              : "",
          },
        ],
        { session }
      );
      createdOrder = createdOrder[0];



      if (appliedCoupon) {

        appliedCoupon.usedCount += 1;

        await appliedCoupon.save({
          session,
        });
      }



      cart.items = [];

      await cart.save({
        session,
      });
    });



    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
      totalAmount,
      discountAmount,
      finalAmount,
    });

  } catch (error) {

    console.error(
      "PLACE ORDER ERROR:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message: error.message,
    });

  } finally {

    await session.endSession();
  }
};



export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    if (
      order.orderStatus === "Shipped" ||
      order.orderStatus === "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${order.orderStatus.toLowerCase()} order`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        continue;
      }

      // Product has sizes
      if (product.sizes && product.sizes.length > 0) {
        const selectedSize = product.sizes.find(
          (s) => Number(s.size) === Number(item.size)
        );

        if (selectedSize) {
          selectedSize.stock += item.quantity;
        }

        // Recalculate total stock
        product.stock = product.sizes.reduce(
          (total, size) =>
            total + Number(size.stock || 0),
          0
        );
      } else {
        // Product without sizes
        product.stock += item.quantity;
      }

      await product.save();
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    // Validate requested status
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = order.orderStatus;

    // Don't update if already same status
    if (currentStatus === orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${orderStatus}`,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Cancelled orders are final
    |--------------------------------------------------------------------------
    */

    if (currentStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delivered orders are final
    |--------------------------------------------------------------------------
    */

    if (currentStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be changed",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Cancelled orders cannot be created after shipping
    |--------------------------------------------------------------------------
    */

    if (
      orderStatus === "Cancelled" &&
      (
        currentStatus === "Shipped" ||
        currentStatus === "Out for Delivery"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already ${currentStatus.toLowerCase()}`,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent invalid backward status transitions
    |--------------------------------------------------------------------------
    */

    const statusOrder = {
      Pending: 1,
      Confirmed: 2,
      Packed: 3,
      Shipped: 4,
      "Out for Delivery": 5,
      Delivered: 6,
    };

    if (
      orderStatus !== "Cancelled" &&
      statusOrder[orderStatus] < statusOrder[currentStatus]
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot move order from ${currentStatus} back to ${orderStatus}`,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delivered
    |--------------------------------------------------------------------------
    */

    if (orderStatus === "Delivered") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              totalSold: item.quantity,
            },
          }
        );
      }

      // COD becomes paid when delivered
      if (order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Cancelled
    |--------------------------------------------------------------------------
    */

    if (orderStatus === "Cancelled") {
      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (!product) {
          continue;
        }

        // Product has sizes
        if (product.sizes && product.sizes.length > 0) {
          const selectedSize = product.sizes.find(
            (s) => Number(s.size) === Number(item.size)
          );

          if (selectedSize) {
            selectedSize.stock += item.quantity;
          }

          // Recalculate total stock
          product.stock = product.sizes.reduce(
            (total, size) =>
              total + Number(size.stock || 0),
            0
          );
        } else {
          // Product without sizes
          product.stock += item.quantity;
        }

        await product.save();
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Update order status
    |--------------------------------------------------------------------------
    */

    order.orderStatus = orderStatus;

    /*
    |--------------------------------------------------------------------------
    | Tracking history
    |--------------------------------------------------------------------------
    */

    order.trackingHistory.push({
      status: orderStatus,
      updatedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getOrderReport = async (req, res) => {
  try {
    const {
      from,
      to,
      orderStatus,
      paymentStatus,
    } = req.query;

    const filter = {};

    // Date Filter
    if (from || to) {
      filter.createdAt = {};

      if (from) {
        filter.createdAt.$gte = new Date(from);
      }

      if (to) {
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = endDate;
      }
    }

    // Order Status
    if (orderStatus && orderStatus !== "All") {
      filter.orderStatus = orderStatus;
    }

    // Payment Status
    if (paymentStatus && paymentStatus !== "All") {
      filter.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const summary = {
      totalOrders: orders.length,

      totalRevenue: orders.reduce(
        (acc, order) =>
          acc + order.finalAmount,
        0
      ),

      delivered: orders.filter(
        (o) =>
          o.orderStatus === "Delivered"
      ).length,

      pending: orders.filter(
        (o) =>
          o.orderStatus === "Pending"
      ).length,

      cancelled: orders.filter(
        (o) =>
          o.orderStatus === "Cancelled"
      ).length,

      paid: orders.filter(
        (o) =>
          o.paymentStatus === "Paid"
      ).length,

      unpaid: orders.filter(
        (o) =>
          o.paymentStatus === "Pending"
      ).length,
    };

    res.status(200).json({
      success: true,
      summary,
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};





export const exportOrdersExcel = async (req, res) => {
  try {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 20 },
      { header: "Customer", key: "customer", width: 25 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Email", key: "email", width: 28 },
      { header: "Products", key: "products", width: 45 },
      { header: "Quantity", key: "qty", width: 12 },
      { header: "Payment", key: "payment", width: 15 },
      { header: "Payment Status", key: "paymentStatus", width: 18 },
      { header: "Order Status", key: "orderStatus", width: 18 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 });

    orders.forEach((order) => {

      worksheet.addRow({

        orderId: order._id
          .toString()
          .slice(-8)
          .toUpperCase(),

        customer: order.shippingAddress.fullName,

        phone: order.shippingAddress.phone,

        email: order.shippingAddress.email,

        products: order.items
          .map((item) => item.product?.name)
          .join(", "),

        qty: order.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),

        payment: order.paymentMethod,

        paymentStatus: order.paymentStatus,

        orderStatus: order.orderStatus,

        amount: order.finalAmount,

        date: new Date(
          order.createdAt
        ).toLocaleDateString(),

      });

    });

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.eachRow((row) => {

      row.eachCell((cell) => {

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        };

      });

    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Orders-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};