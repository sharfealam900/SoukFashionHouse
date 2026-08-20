import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/order.model.js";

import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";

import { placeOrder } from "./order.controller.js";


// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      shippingAddress,
      couponCode,
    } = req.body;


    // ==========================================================
    // 1. VALIDATE SHIPPING ADDRESS
    // ==========================================================

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.email ||
      !shippingAddress?.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }


    // ==========================================================
    // 2. GET CART
    // ==========================================================

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");


    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }


    // ==========================================================
    // 3. REMOVE STALE PRODUCTS
    // ==========================================================

    const validItems = cart.items.filter(
      (item) => item.product
    );

    const invalidItems = cart.items.filter(
      (item) => !item.product
    );


    if (invalidItems.length > 0) {
      cart.items = validItems;

      await cart.save();
    }


    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "All products in your cart are no longer available.",
      });
    }


    // ==========================================================
    // 4. CALCULATE PRODUCTS + VALIDATE STOCK
    // ==========================================================

    let totalAmount = 0;

    const orderItems = [];


    for (const item of validItems) {
      const product = item.product;

      const quantity = Number(item.quantity);


      // --------------------------------------------------------
      // Validate quantity
      // --------------------------------------------------------

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name}: invalid quantity`,
        });
      }


      // --------------------------------------------------------
      // Validate size
      // --------------------------------------------------------

      if (product.sizes?.length > 0) {

        const selectedSize = product.sizes.find(
          (sizeItem) =>
            Number(sizeItem.size) ===
            Number(item.size)
        );


        if (!selectedSize) {
          return res.status(400).json({
            success: false,
            message:
              `${product.name}: selected size is no longer available`,
          });
        }


        if (selectedSize.stock <= 0) {
          return res.status(400).json({
            success: false,
            message:
              `${product.name}: size ${selectedSize.size} is out of stock`,
          });
        }


        if (quantity > selectedSize.stock) {
          return res.status(400).json({
            success: false,
            message:
              `${product.name}: only ${selectedSize.stock} item(s) available in size ${selectedSize.size}`,
          });
        }

      } else {

        // ------------------------------------------------------
        // Product without size
        // ------------------------------------------------------

        if (
          Number(product.stock) < quantity
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${product.name} is out of stock`,
          });
        }
      }


      // ========================================================
      // PRODUCT DISCOUNT
      // ========================================================

      const productDiscount =
        Number(product.discount || 0);


      const price =
        Number(product.price) -
        (
          Number(product.price) *
          productDiscount
        ) /
        100;


      totalAmount += price * quantity;


      // ========================================================
      // PREPARE ORDER ITEM
      // ========================================================

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


    // ==========================================================
    // 5. COUPON
    // ==========================================================

    let discountAmount = 0;

    let appliedCoupon = null;


    if (couponCode) {

      const normalizedCouponCode =
        String(couponCode)
          .trim()
          .toUpperCase();


      const coupon = await Coupon.findOne({
        code: normalizedCouponCode,
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


      if (
        coupon.expiresAt &&
        coupon.expiresAt < new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired.",
        });
      }


      if (
        coupon.usedCount >=
        coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon usage limit exceeded.",
        });
      }


      if (
        totalAmount <
        coupon.minimumOrderAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
        });
      }


      // --------------------------------------------------------
      // Percentage coupon
      // --------------------------------------------------------

      if (
        coupon.discountType ===
        "percentage"
      ) {

        discountAmount =
          (
            totalAmount *
            coupon.discountValue
          ) /
          100;


        if (coupon.maximumDiscount) {
          discountAmount =
            Math.min(
              discountAmount,
              coupon.maximumDiscount
            );
        }

      } else {

        // ------------------------------------------------------
        // Fixed coupon
        // ------------------------------------------------------

        discountAmount =
          coupon.discountValue;
      }


      // Never discount more than subtotal

      discountAmount =
        Math.min(
          discountAmount,
          totalAmount
        );


      appliedCoupon = coupon;
    }


    // ==========================================================
    // 6. FINAL AMOUNT
    // ==========================================================

    const finalAmount =
      Math.max(
        totalAmount -
        discountAmount,
        0
      );


    // ==========================================================
    // 7. PREPARE ITEM PRICES AFTER COUPON
    // ==========================================================

    if (
      discountAmount > 0 &&
      totalAmount > 0
    ) {

      const ratio =
        finalAmount /
        totalAmount;


      orderItems.forEach((item) => {

        item.price =
          Number(
            (
              item.price *
              ratio
            ).toFixed(2)
          );

      });
    }


    // ==========================================================
    // 8. RAZORPAY AMOUNT
    // ==========================================================

    const amountInPaise =
      Math.round(
        finalAmount * 100
      );


    if (amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment amount.",
      });
    }


    // ==========================================================
    // 9. CREATE RAZORPAY ORDER
    // ==========================================================

    const razorpayOrder =
      await razorpay.orders.create({

        amount: amountInPaise,

        currency: "INR",

        receipt:
          `order_${userId}_${Date.now()}`,

        notes: {
          userId:
            userId.toString(),

          couponCode:
            couponCode || "",

          totalAmount:
            String(totalAmount),

          discountAmount:
            String(discountAmount),

          finalAmount:
            String(finalAmount),
        },
      });


    // ==========================================================
    // 10. SEND RESPONSE
    // ==========================================================

    return res.status(200).json({

      success: true,

      message:
        "Razorpay order created",

      razorpayOrderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      key:
        process.env.RAZORPAY_KEY_ID,

      amountDetails: {
        totalAmount,
        discountAmount,
        finalAmount,
      },

    });

  } catch (error) {

    console.error(
      "Create Razorpay order error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to create Razorpay order",
    });
  }
};



// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      couponCode,
    } = req.body;

    // ========================================================
    // 1. CHECK REQUIRED PAYMENT DATA
    // ========================================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment information is missing",
      });
    }

    // ========================================================
    // 2. PREVENT DUPLICATE PAYMENT PROCESSING
    // ========================================================

    const existingOrder = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        order: existingOrder,
      });
    }

    // ========================================================
    // 3. GENERATE SIGNATURE
    // ========================================================

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // ========================================================
    // 4. VERIFY SIGNATURE
    // ========================================================

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ========================================================
    // 5. FETCH RAZORPAY ORDER
    // ========================================================

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    // ========================================================
    // 6. MAKE SURE PAYMENT BELONGS TO CURRENT USER
    // ========================================================

    if (
      razorpayOrder.notes?.userId &&
      razorpayOrder.notes.userId !==
        userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This payment does not belong to this user",
      });
    }

    // ========================================================
    // 7. FETCH PAYMENT
    // ========================================================

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    // ========================================================
    // 8. VERIFY PAYMENT ORDER ID
    // ========================================================

    if (
      payment.order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this order",
      });
    }

    // ========================================================
    // 9. VERIFY PAYMENT STATUS
    // ========================================================

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message:
          "Payment has not been captured",
      });
    }

    // ========================================================
    // 10. VERIFY PAYMENT AMOUNT
    // ========================================================

    if (
      Number(payment.amount) !==
      Number(razorpayOrder.amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    // ========================================================
    // 11. PASS VERIFIED PAYMENT TO EXISTING ORDER LOGIC
    // ========================================================

    req.body = {
      shippingAddress,

      paymentMethod: "RAZORPAY",

      couponCode,

      razorpayOrderId:
        razorpay_order_id,

      razorpayPaymentId:
        razorpay_payment_id,

      razorpaySignature:
        razorpay_signature,
    };

    // ========================================================
    // 12. CREATE ACTUAL E-COMMERCE ORDER
    // ========================================================

    return await placeOrder(
      req,
      res
    );

  } catch (error) {
    console.error(
      "Razorpay verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify Razorpay payment",
    });
  }
};