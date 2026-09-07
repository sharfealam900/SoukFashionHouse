import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

const optimizeCloudinaryImage = (
  url,
  width = 600
) => {
  if (
    !url ||
    !url.includes("res.cloudinary.com")
  ) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  if (
    url.includes("f_auto") ||
    url.includes("q_auto")
  ) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width}/`
  );
};

const optimizeProductImages = (
  images,
  width = 600
) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => ({
    ...image,
    url: optimizeCloudinaryImage(
      image?.url,
      width
    ),
  }));
};

const optimizeColorVariants = (
  variants,
  width = 600
) => {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants.map((variant) => ({
    ...variant,
    images: optimizeProductImages(
      variant?.images,
      width
    ),
  }));
};

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseColorVariants = (value) => {
  const parsed = parseJson(value, []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((variant) => ({
      name: String(variant?.name || "").trim(),
      hex: String(variant?.hex || "").trim(),
      images: Array.isArray(variant?.images)
        ? variant.images
        : [],
    }))
    .filter((variant) => variant.name);
};

const uploadProductFiles = async (files = []) => {
  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadToCloudinary(
      file.buffer
    );

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  return uploadedImages;
};

const buildColorVariants = (metadata, uploadedImages) => {
  return metadata.map((variant) => ({
    name: variant.name,
    hex: variant.hex || "",
    images: (variant.images || [])
      .map((entry) => {
        if (entry?.type === "new") {
          return uploadedImages[Number(entry.index)];
        }

        if (
          entry?.type === "existing" &&
          entry?.public_id
        ) {
          return {
            url: entry.url || "",
            public_id: entry.public_id,
          };
        }

        return null;
      })
      .filter((image) => image?.public_id || image?.url),
  }));
};

const flattenColorImages = (variants) => {
  const seen = new Set();
  const images = [];

  for (const variant of variants || []) {
    for (const image of variant.images || []) {
      if (!image?.public_id && !image?.url) {
        continue;
      }

      const key = image.public_id || image.url;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      images.push(image);
    }
  }

  return images;
};

const deleteCloudinaryImages = async (images = []) => {
  const ids = [
    ...new Set(
      images
        .map((image) => image?.public_id)
        .filter(Boolean)
    ),
  ];

  for (const publicId of ids) {
    try {
      await cloudinary.uploader.destroy(
        publicId
      );
    } catch (error) {
      console.error(
        "CLOUDINARY DELETE ERROR:",
        publicId,
        error.message
      );
    }
  }
};

const optimizeListProducts = (
  products,
  width = 600
) => {
  return products.map((product) => ({
    ...product,
    images: optimizeProductImages(
      product.images,
      width
    ),
  }));
};

const parseProductSizes = (sizes) => {
  if (!sizes) {
    return [];
  }

  let parsed;

  try {
    if (typeof sizes === "string") {
      parsed = JSON.parse(sizes);
    } else if (Array.isArray(sizes)) {
      parsed = sizes;
    } else {
      return [];
    }

    if (
      Array.isArray(parsed) &&
      parsed.length === 1 &&
      typeof parsed[0] === "string"
    ) {
      parsed = JSON.parse(parsed[0]);
    }
  } catch (error) {
    return [];
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

export const createProduct = async (
  req,
  res
) => {
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
      colorVariants,
    } = req.body;

    let parsedSizes = [];

    if (sizes) {
      parsedSizes = sizes;

      if (typeof parsedSizes === "string") {
        parsedSizes =
          JSON.parse(parsedSizes);
      }

      if (
        Array.isArray(parsedSizes) &&
        parsedSizes.length === 1 &&
        typeof parsedSizes[0] === "string"
      ) {
        parsedSizes =
          JSON.parse(parsedSizes[0]);
      }
    }

    if (!Array.isArray(parsedSizes)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid product sizes format",
      });
    }

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

    const categoryExists =
      await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const parsedColorVariants =
      parseColorVariants(colorVariants);

    const uploadedImages =
      await uploadProductFiles(
        req.files || []
      );

    const finalColorVariants =
      buildColorVariants(
        parsedColorVariants,
        uploadedImages
      );

    const flattenedImages =
      finalColorVariants.length > 0
        ? flattenColorImages(
            finalColorVariants
          )
        : uploadedImages;

    let slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const existing =
      await Product.findOne({ slug });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const sku = `SOUK-${Date.now()}`;

    const product =
      await Product.create({
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
        colors: finalColorVariants.length > 0
          ? finalColorVariants.map(
              (variant) => variant.name
            )
          : colors,
        colorVariants: finalColorVariants,
        images: flattenedImages,
      });

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (
  req,
  res
) => {
  try {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit, 10) || 20,
        1
      ),
      40
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : "";

    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : "featured";

    const skip = (page - 1) * limit;

    const filter = {
      isActive: true,
    };

    if (
      category &&
      category !== "all"
    ) {
      filter.category = category;
    }

    if (search) {
      const escapedSearch =
        search.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const searchRegex =
        new RegExp(
          escapedSearch,
          "i"
        );

      filter.$or = [
        {
          name: searchRegex,
        },
        {
          description: searchRegex,
        },
      ];
    }

    let sortOption = {
      featured: -1,
      createdAt: -1,
    };

    switch (sort) {
      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      case "price-low":
        sortOption = {
          price: 1,
          _id: 1,
        };
        break;

      case "price-high":
        sortOption = {
          price: -1,
          _id: 1,
        };
        break;

      case "featured":
      default:
        sortOption = {
          featured: -1,
          createdAt: -1,
        };
        break;
    }

    const [
      products,
      total,
    ] = await Promise.all([
      Product.find(filter)
        .select(
          "name slug category price discount stock images featured createdAt"
        )
        .populate(
          "category",
          "name slug"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const optimizedProducts =
      optimizeListProducts(
        products,
        600
      );

    const totalPages =
      Math.ceil(total / limit);

    res.set(
      "Cache-Control",
      "public, max-age=10, s-maxage=30, stale-while-revalidate=120"
    );

    return res.status(200).json({
      success: true,
      products: optimizedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load products",
    });
  }
};

export const getProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    let product;

    if (
      mongoose.Types.ObjectId.isValid(id)
    ) {
      product =
        await Product.findById(id)
          .populate(
            "category",
            "name slug"
          )
          .lean();
    }

    if (!product) {
      product =
        await Product.findOne({
          slug: id,
        })
          .populate(
            "category",
            "name slug"
          )
          .lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: {
        ...product,
        images:
          optimizeProductImages(
            product.images,
            1200
          ),
        colorVariants:
          optimizeColorVariants(
            product.colorVariants,
            1200
          ),
      },
    });
  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (
  req,
  res
) => {
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
      colorVariants,
      featured,
      isActive,
    } = req.body;

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let parsedSizes =
      product.sizes;

    if (sizes) {
      parsedSizes = sizes;

      if (typeof parsedSizes === "string") {
        parsedSizes =
          JSON.parse(parsedSizes);
      }

      if (
        Array.isArray(parsedSizes) &&
        parsedSizes.length === 1 &&
        typeof parsedSizes[0] === "string"
      ) {
        parsedSizes =
          JSON.parse(parsedSizes[0]);
      }
    }

    product.sizes = parsedSizes;

    if (category) {
      const categoryExists =
        await Category.findById(
          category
        );

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    let slug = product.slug;

    if (
      name &&
      name !== product.name
    ) {
      slug = slugify(name, {
        lower: true,
        strict: true,
      });

      const existing =
        await Product.findOne({
          slug,
          _id: {
            $ne: product._id,
          },
        });

      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const uploadedImages =
      await uploadProductFiles(
        req.files || []
      );

    let nextImages = product.images || [];
    let nextColorVariants =
      product.colorVariants || [];

    if (colorVariants !== undefined) {
      const parsedColorVariants =
        parseColorVariants(
          colorVariants
        );

      nextColorVariants =
        buildColorVariants(
          parsedColorVariants,
          uploadedImages
        );

      nextImages = flattenColorImages(
        nextColorVariants
      );

      const oldImages = [
        ...(product.images || []),
        ...flattenColorImages(
          product.colorVariants || []
        ),
      ];

      const retainedIds = new Set(
        nextImages
          .map((image) => image.public_id)
          .filter(Boolean)
      );

      const imagesToDelete =
        oldImages.filter(
          (image) =>
            image.public_id &&
            !retainedIds.has(
              image.public_id
            )
        );

      await deleteCloudinaryImages(
        imagesToDelete
      );
    } else if (uploadedImages.length > 0) {
      nextImages = [
        ...(product.images || []),
        ...uploadedImages,
      ];
    }

    product.images = nextImages;

    product.name =
      name ?? product.name;

    product.slug = slug;

    product.description =
      description ??
      product.description;

    product.category =
      category ?? product.category;

    product.brand =
      brand ?? product.brand;

    product.gender =
      gender ?? product.gender;

    product.price =
      price ?? product.price;

    product.discount =
      discount ?? product.discount;

    product.stock =
      stock ?? product.stock;

    product.sizes = parsedSizes;

    if (colorVariants !== undefined) {
      product.colorVariants =
        nextColorVariants;
      product.colors =
        nextColorVariants.map(
          (variant) => variant.name
        );
    } else {
      product.colors =
        colors ?? product.colors;
    }

    if (featured !== undefined) {
      product.featured = featured;
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    await product.save();

    await product.populate(
      "category",
      "name slug"
    );

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await deleteCloudinaryImages([
      ...(product.images || []),
      ...flattenColorImages(
        product.colorVariants || []
      ),
    ]);

    const result =
      await Cart.updateMany(
        {},
        {
          $pull: {
            items: {
              product: product._id,
            },
          },
        }
      );

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRelatedProducts =
  async (req, res) => {
    try {
      const {
        categoryId,
        productId,
      } = req.params;

      const products =
        await Product.find({
          category: categoryId,
          _id: {
            $ne: productId,
          },
          isActive: true,
        })
          .select(
            "name slug category price discount stock images featured averageRating"
          )
          .populate(
            "category",
            "name slug"
          )
          .limit(4)
          .sort({
            createdAt: -1,
          })
          .lean();

      const optimizedProducts =
        optimizeListProducts(
          products,
          600
        );

      res.set(
        "Cache-Control",
        "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
      );

      return res.status(200).json({
        success: true,
        products:
          optimizedProducts,
      });
    } catch (error) {
      console.error(
        "GET RELATED PRODUCTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getBestSellers =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
        })
          .select(
            "name slug category price discount stock totalSold sizes colors featured averageRating images"
          )
          .populate(
            "category",
            "name slug"
          )
          .sort({
            totalSold: -1,
            createdAt: -1,
          })
          .limit(8)
          .lean();

      const optimizedProducts =
        optimizeListProducts(
          products,
          600
        );

      res.set(
        "Cache-Control",
        "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
      );

      return res.status(200).json({
        success: true,
        products:
          optimizedProducts,
      });
    } catch (error) {
      console.error(
        "GET BEST SELLERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load best sellers",
      });
    }
  };

export const getNewArrivals =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
        })
          .select(
            "name slug category price discount stock totalSold sizes colors featured averageRating images"
          )
          .populate(
            "category",
            "name slug"
          )
          .sort({
            createdAt: -1,
          })
          .limit(8)
          .lean();

      const optimizedProducts =
        optimizeListProducts(
          products,
          600
        );

      res.set(
        "Cache-Control",
        "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
      );

      return res.status(200).json({
        success: true,
        products:
          optimizedProducts,
      });
    } catch (error) {
      console.error(
        "GET NEW ARRIVALS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load new arrivals",
      });
    }
  };

let homeSectionsCache = null;
let homeSectionsCacheTime = 0;

export const getHomeSections =
  async (req, res) => {
    try {
      const now = Date.now();

      if (
        homeSectionsCache &&
        now -
          homeSectionsCacheTime <
          30000
      ) {
        res.set(
          "Cache-Control",
          "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
        );

        return res.status(200).json({
          success: true,
          bestSellers:
            homeSectionsCache.bestSellers,
          newArrivals:
            homeSectionsCache.newArrivals,
        });
      }

      const [
        bestSellers,
        newArrivals,
      ] = await Promise.all([
        Product.find({
          isActive: true,
        })
          .select(
            "name slug category price discount stock totalSold sizes colors featured averageRating images"
          )
          .populate(
            "category",
            "name slug"
          )
          .sort({
            totalSold: -1,
            createdAt: -1,
          })
          .limit(8)
          .lean(),

        Product.find({
          isActive: true,
        })
          .select(
            "name slug category price discount stock totalSold sizes colors featured averageRating images"
          )
          .populate(
            "category",
            "name slug"
          )
          .sort({
            createdAt: -1,
          })
          .limit(8)
          .lean(),
      ]);

      const optimizedBestSellers =
        optimizeListProducts(
          bestSellers,
          600
        );

      const optimizedNewArrivals =
        optimizeListProducts(
          newArrivals,
          600
        );

      homeSectionsCache = {
        bestSellers:
          optimizedBestSellers,
        newArrivals:
          optimizedNewArrivals,
      };

      homeSectionsCacheTime = now;

      res.set(
        "Cache-Control",
        "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
      );

      return res.status(200).json({
        success: true,
        bestSellers:
          optimizedBestSellers,
        newArrivals:
          optimizedNewArrivals,
      });
    } catch (error) {
      console.error(
        "GET HOME SECTIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load homepage products",
      });
    }
  };

export const deleteProductImage =
  async (req, res) => {
    try {
      const { id } = req.params;

      const imageId =
        decodeURIComponent(
          req.params.imageId
        );

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      let imageFound = false;
      let imageToDelete = null;

      const mainImage =
        product.images.find(
          (img) =>
            img.public_id === imageId
        );

      if (mainImage) {
        imageFound = true;
        imageToDelete = mainImage;
      }

      product.images =
        product.images.filter(
          (img) =>
            img.public_id !== imageId
        );

      product.colorVariants =
        (product.colorVariants || []).map(
          (variant) => {
            const matched =
              variant.images.find(
                (img) =>
                  img.public_id === imageId
              );

            if (matched) {
              imageFound = true;
              imageToDelete =
                imageToDelete || matched;
            }

            return {
              name: variant.name,
              hex: variant.hex,
              images: variant.images.filter(
                (img) =>
                  img.public_id !== imageId
              ),
            };
          }
        );

      if (!imageFound) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }

      if (imageToDelete?.public_id) {
        await cloudinary.uploader.destroy(
          imageToDelete.public_id
        );
      }

      const variantImages =
        flattenColorImages(
          product.colorVariants
        );

      if (variantImages.length > 0) {
        product.images = variantImages;
      }

      await product.save();

      return res.status(200).json({
        success: true,
        message:
          "Image deleted successfully",
        product,
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT IMAGE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };