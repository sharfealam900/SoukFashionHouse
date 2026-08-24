import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";


const parseProductSizes = (sizes) => {
  if (!sizes) {
    return [];
  }

  let parsed;

  // Normal JSON string from FormData
  if (typeof sizes === "string") {
    parsed = JSON.parse(sizes);
  }

  // Multer/body parser can sometimes give an array
  else if (Array.isArray(sizes)) {
    parsed = sizes;
  }

  else {
    return [];
  }

  // Handle old/corrupted format:
  // ["[{\"size\":6,\"stock\":5}]"]
  if (
    Array.isArray(parsed) &&
    parsed.length === 1 &&
    typeof parsed[0] === "string"
  ) {
    parsed = JSON.parse(parsed[0]);
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => ({
      size: Number(item.size),
      stock: Number(item.stock || 0),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.size) &&
        Number.isFinite(item.stock) &&
        item.size > 0 &&
        item.stock >= 0
    );
};


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      gender,
      price,
      discount,
      stock,
      sizes,
      colors,
    } = req.body;



    let parsedSizes = [];

    if (sizes) {
      parsedSizes = sizes;

      // FormData sends sizes as a string
      if (typeof parsedSizes === "string") {
        parsedSizes = JSON.parse(parsedSizes);
      }

      // Handle accidentally double-stringified sizes
      if (
        Array.isArray(parsedSizes) &&
        parsedSizes.length === 1 &&
        typeof parsedSizes[0] === "string"
      ) {
        parsedSizes = JSON.parse(parsedSizes[0]);
      }
    }

    // Make sure sizes is actually an array
    if (!Array.isArray(parsedSizes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product sizes format",
      });
    }

    // Clean and normalize sizes
    parsedSizes = parsedSizes
      .map((item) => ({
        size: Number(item.size),
        stock: Number(item.stock || 0),
      }))
      .filter(
        (item) =>
          !Number.isNaN(item.size) &&
          item.size > 0 &&
          !Number.isNaN(item.stock) &&
          item.stock >= 0
      );



   

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }



    let slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const existing = await Product.findOne({ slug });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }



    const sku = `SOUK-${Date.now()}`;



    const product = await Product.create({
      name,
      slug,
      description,
      category,
      brand,
      gender,
      price,
      discount,
      stock,
      sku,
      sizes: parsedSizes,
      colors,
      images: uploadedImages,
    });


    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};








export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product;

    // If the parameter is a valid MongoDB ObjectId,
    // first search by _id.
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate(
        "category",
        "name slug"
      );
    }

    // Otherwise search using the SEO slug.
    if (!product) {
      product = await Product.findOne({
        slug: id,
      }).populate("category", "name slug");
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      gender,
      price,
      discount,
      stock,
      sizes,
      colors,
      featured,
      isActive,
    } = req.body;

    // Find Product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let parsedSizes = product.sizes;

    if (sizes) {
      parsedSizes = sizes;

      if (typeof parsedSizes === "string") {
        parsedSizes = JSON.parse(parsedSizes);
      }

      if (
        Array.isArray(parsedSizes) &&
        parsedSizes.length === 1 &&
        typeof parsedSizes[0] === "string"
      ) {
        parsedSizes = JSON.parse(parsedSizes[0]);
      }
    }

    product.sizes = parsedSizes;



    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate Category
    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Generate unique slug if name changes
    let slug = product.slug;

    if (name && name !== product.name) {
      slug = slugify(name, {
        lower: true,
        strict: true,
      });

      const existing = await Product.findOne({
        slug,
        _id: { $ne: product._id },
      });

      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Upload newly selected images
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // Keep old images + append new ones
    product.images = [...product.images, ...uploadedImages];

    // Update fields
    product.name = name ?? product.name;
    product.slug = slug;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.gender = gender ?? product.gender;
    product.price = price ?? product.price;
    product.discount = discount ?? product.discount;
    product.stock = stock ?? product.stock;
    product.sizes = parsedSizes;
    product.colors = colors ?? product.colors;

    if (featured !== undefined) {
      product.featured = featured;
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    await product.save();

    await product.populate("category", "name slug");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteProduct = async (req, res) => {
  console.log("DELETE PRODUCT CONTROLLER HIT");
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete Cloudinary images
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    console.log("Deleting Product ID:", product._id);

    const result = await Cart.updateMany(
      {},
      {
        $pull: {
          items: {
            product: product._id,
          },
        },
      }
    );

    console.log("Cart Update Result:", result);

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getRelatedProducts = async (req, res) => {
  try {

    const { categoryId, productId } = req.params;

    const products = await Product.find({
      category: categoryId,
      _id: { $ne: productId },
      isActive: true,
    })
      .populate("category")
      .limit(4)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= BEST SELLERS =================

export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name slug")
      .sort({ totalSold: -1, createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= NEW ARRIVALS =================

export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageId = decodeURIComponent(req.params.imageId);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const image = product.images.find(
      (img) => img.public_id === imageId
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Remove from MongoDB
    product.images = product.images.filter(
      (img) => img.public_id !== imageId
    );

    await product.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};