import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import ExcelJS from "exceljs";

/* ============================
   PLACE ORDER
============================ */

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { shippingAddress, paymentMethod, couponCode } = req.body;

    const {
      fullName,
      phone,
      email,
      address,
    } = shippingAddress;

    if (
      !fullName ||
      !phone ||
      !email ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }


    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }


    let totalAmount = 0;
    let discountAmount = 0;
    let finalAmount = 0;
    let appliedCoupon = null;

    const orderItems = [];

    // First calculate subtotal
    for (const item of cart.items) {

      const product = item.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      const productDiscount = Number(product.discount || 0);

      const price =
        product.price -
        (product.price * productDiscount) / 100;

      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price,
      });

      product.stock -= item.quantity;
      await product.save();
    }





    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon.",
        });
      }

      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive.",
        });
      }

      if (coupon.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired.",
        });
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit exceeded.",
        });
      }

      if (totalAmount < coupon.minimumOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
        });
      }

      if (coupon.discountType === "percentage") {
        discountAmount =
          (totalAmount * coupon.discountValue) / 100;

        if (coupon.maximumDiscount) {
          discountAmount = Math.min(
            discountAmount,
            coupon.maximumDiscount
          );
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      appliedCoupon = coupon;
    }

    finalAmount = Math.max(
      totalAmount - discountAmount,
      0
    );

    // Apply coupon discount to each item price
    if (discountAmount > 0) {

      const ratio = finalAmount / totalAmount;

      orderItems.forEach((item) => {

        item.price = Number(
          (item.price * ratio).toFixed(2)
        );

      });

    }


    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,

      totalAmount,
      discountAmount,
      finalAmount,

      coupon: appliedCoupon
        ? appliedCoupon._id
        : null,

      couponCode: appliedCoupon
        ? appliedCoupon.code
        : "",
    });



    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }




    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      totalAmount,
      discountAmount,
      finalAmount,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   GET MY ORDERS
============================ */

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

/* ============================
   GET SINGLE ORDER
============================ */

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

/* ============================
   CANCEL ORDER
============================ */

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

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
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

/* ============================
   ADMIN - GET ALL ORDERS
============================ */

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

/* ============================
   ADMIN - UPDATE ORDER STATUS
============================ */

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

    // Don't update if already same status
    if (order.orderStatus === orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${orderStatus}`,
      });
    }

    // If delivered for first time
    if (
      orderStatus === "Delivered" &&
      order.orderStatus !== "Delivered"
    ) {
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

      if (order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
      }
    }

    // Update current status
    order.orderStatus = orderStatus;

    // Save tracking history
    order.trackingHistory.push({
      status: orderStatus,
      updatedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });

  } catch (error) {
    res.status(500).json({
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