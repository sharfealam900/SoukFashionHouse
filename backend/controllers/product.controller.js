import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

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

    // Check category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 👇 ADD THIS CODE HERE
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
      sizes,
      colors,
      images: uploadedImages, // 👈 Add this too
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
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
    product.sizes = sizes ?? product.sizes;
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
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
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