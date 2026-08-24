import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/order.model.js";

import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";

import { placeOrder } from "./order.controller.js";




export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      shippingAddress,
      couponCode,
    } = req.body;



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



    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");


    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }




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




    let totalAmount = 0;

    const orderItems = [];


    for (const item of validItems) {
      const product = item.product;

      const quantity = Number(item.quantity);




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



    const finalAmount =
      Math.max(
        totalAmount -
        discountAmount,
        0
      );




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



    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");



    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }



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


    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );



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



    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message:
          "Payment has not been captured",
      });
    }



    if (
      Number(payment.amount) !==
      Number(razorpayOrder.amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }



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