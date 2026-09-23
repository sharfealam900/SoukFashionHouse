import mongoose from "mongoose";

const colorVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hex: {
      type: String,
      default: "",
      trim: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { _id: false }
);

const productDetailsSchema = new mongoose.Schema(
  {
    productType: {
      type: String,
      default: "",
      trim: true,
    },

    fabric: {
      type: String,
      default: "",
      trim: true,
    },

    work: {
      type: String,
      default: "",
      trim: true,
    },

    pattern: {
      type: String,
      default: "",
      trim: true,
    },

    neckType: {
      type: String,
      default: "",
      trim: true,
    },

    sleeveType: {
      type: String,
      default: "",
      trim: true,
    },

    fit: {
      type: String,
      default: "",
      trim: true,
    },

    colour: {
      type: String,
      default: "",
      trim: true,
    },

    season: {
      type: String,
      default: "",
      trim: true,
    },

    sizesAvailable: {
      type: String,
      default: "",
      trim: true,
    },

    closure: {
      type: String,
      default: "",
      trim: true,
    },

    occasion: {
      type: String,
      default: "",
      trim: true,
    },

    length: {
      type: String,
      default: "",
      trim: true,
    },

    packageContains: {
      type: String,
      default: "",
      trim: true,
    },

    workmanship: {
      type: String,
      default: "",
      trim: true,
    },

    countryOfOrigin: {
      type: String,
      default: "",
      trim: true,
    },

    careInstructions: {
      type: [String],
      default: [],
    },

    deliveryServices: {
      type: [String],
      default: [],
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    productDetails: {
      type: productDetailsSchema,
      default: () => ({}),
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      default: "Unisex",
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    sizes: [
      {
        size: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    colorVariants: {
      type: [colorVariantSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  isActive: 1,
  totalSold: -1,
  createdAt: -1,
});

productSchema.index({
  isActive: 1,
  createdAt: -1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;