import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY", "STRIPE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },


    trackingHistory: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Confirmed",
            "Packed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
          ],
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    estimatedDelivery: {
      type: Date,
    },


    totalAmount: {
      type: Number,
      required: true,
    },


    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    couponCode: {
      type: String,
      default: "",
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },



  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function () {
  if (this.isNew) {
    if (!this.trackingHistory) {
      this.trackingHistory = [];
    }

    if (this.trackingHistory.length === 0) {
      this.trackingHistory.push({
        status: "Pending",
      });
    }

    if (!this.estimatedDelivery) {
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 5);
      this.estimatedDelivery = delivery;
    }
  }
});



export default mongoose.model("Order", orderSchema);