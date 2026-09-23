import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

/* =========================================================
   PRODUCT DETAIL FIELDS
========================================================= */

const PRODUCT_DETAIL_FIELDS = [
  "productType",
  "fabric",
  "work",
  "pattern",
  "neckType",
  "sleeveType",
  "fit",
  "colour",
  "season",
  "sizesAvailable",
  "closure",
  "occasion",
  "length",
  "packageContains",
  "workmanship",
  "countryOfOrigin",
  "note",
];

/* =========================================================
   GENERIC HELPERS
========================================================= */

const parseJson = (value, fallback = null) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return Boolean(value);
};

const parseNumber = (value, fallback = 0) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/* =========================================================
   PRODUCT DETAILS
========================================================= */

const parseProductDetails = (value) => {
  const parsed = parseJson(value, {});

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    return {};
  }

  const details = {};

  PRODUCT_DETAIL_FIELDS.forEach((field) => {
    details[field] = String(
      parsed[field] ?? ""
    ).trim();
  });

  details.careInstructions =
    Array.isArray(parsed.careInstructions)
      ? parsed.careInstructions
          .map((item) =>
            String(item ?? "").trim()
          )
          .filter(Boolean)
      : [];

  details.deliveryServices =
    Array.isArray(parsed.deliveryServices)
      ? parsed.deliveryServices
          .map((item) =>
            String(item ?? "").trim()
          )
          .filter(Boolean)
      : [];

  return details;
};

/*
  This allows the backend to accept the product-detail
  fields individually as well.

  Example:

  formData.append("productType", "Kashmiri Ari Work Kurti");
  formData.append("fabric", "Premium Ruby Cotton");
  formData.append("work", "Kashmiri Ari Manual Work");

  It also remains compatible with:

  formData.append(
    "productDetails",
    JSON.stringify({...})
  );
*/

const buildProductDetailsFromRequest = (body) => {
  const jsonDetails = parseProductDetails(
    body.productDetails
  );

  const details = {
    ...jsonDetails,
  };

  PRODUCT_DETAIL_FIELDS.forEach((field) => {
    if (
      body[field] !== undefined &&
      body[field] !== null
    ) {
      details[field] = String(
        body[field]
      ).trim();
    }
  });

  if (body.careInstructions !== undefined) {
    const care = parseJson(
      body.careInstructions,
      []
    );

    details.careInstructions =
      Array.isArray(care)
        ? care
            .map((item) =>
              String(item ?? "").trim()
            )
            .filter(Boolean)
        : [];
  }

  if (body.deliveryServices !== undefined) {
    const delivery = parseJson(
      body.deliveryServices,
      []
    );

    details.deliveryServices =
      Array.isArray(delivery)
        ? delivery
            .map((item) =>
              String(item ?? "").trim()
            )
            .filter(Boolean)
        : [];
  }

  return details;
};

/* =========================================================
   SIZE HELPERS
========================================================= */

const parseProductSizes = (sizes) => {
  if (
    sizes === undefined ||
    sizes === null ||
    sizes === ""
  ) {
    return [];
  }

  let parsed = sizes;

  try {
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    /*
      Sometimes multipart/form-data produces:

      [
        "[{\"size\":42,\"stock\":5}]"
      ]

      Handle that too.
    */

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
      size: Number(item?.size),
      stock: Number(item?.stock ?? 0),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.size) &&
        item.size > 0 &&
        Number.isFinite(item.stock) &&
        item.stock >= 0
    );
};

/* =========================================================
   COLOR VARIANTS
========================================================= */

const parseColorVariants = (value) => {
  const parsed = parseJson(value, []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((variant) => ({
      name: String(
        variant?.name || ""
      ).trim(),

      hex: String(
        variant?.hex || ""
      ).trim(),

      images: Array.isArray(
        variant?.images
      )
        ? variant.images
        : [],
    }))
    .filter(
      (variant) => variant.name
    );
};

/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

const uploadProductFiles = async (
  files = []
) => {
  const uploadedImages = [];

  for (const file of files) {
    const result =
      await uploadToCloudinary(
        file.buffer
      );

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  return uploadedImages;
};

/* =========================================================
   BUILD COLOR VARIANTS
========================================================= */

const buildColorVariants = (
  metadata,
  uploadedImages
) => {
  return metadata.map((variant) => ({
    name: variant.name,

    hex: variant.hex || "",

    images: (variant.images || [])
      .map((entry) => {
        /*
          New image uploaded in this request
        */

        if (
          entry?.type === "new"
        ) {
          const index = Number(
            entry.index
          );

          return uploadedImages[index] || null;
        }

        /*
          Existing Cloudinary image
        */

        if (
          entry?.type === "existing" &&
          entry?.public_id
        ) {
          return {
            url: entry.url || "",
            public_id:
              entry.public_id,
          };
        }

        return null;
      })
      .filter(
        (image) =>
          image?.public_id ||
          image?.url
      ),
  }));
};

/* =========================================================
   FLATTEN COLOR IMAGES
========================================================= */

const flattenColorImages = (
  variants = []
) => {
  const seen = new Set();
  const images = [];

  for (const variant of variants) {
    for (const image of variant.images || []) {
      if (
        !image?.public_id &&
        !image?.url
      ) {
        continue;
      }

      const key =
        image.public_id ||
        image.url;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      images.push({
        url: image.url || "",
        public_id:
          image.public_id || "",
      });
    }
  }

  return images;
};

/* =========================================================
   CLOUDINARY DELETE
========================================================= */

const deleteCloudinaryImages = async (
  images = []
) => {
  const publicIds = [
    ...new Set(
      images
        .map(
          (image) =>
            image?.public_id
        )
        .filter(Boolean)
    ),
  ];

  for (const publicId of publicIds) {
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

/* =========================================================
   IMAGE OPTIMIZATION
========================================================= */

const optimizeCloudinaryImage = (
  url,
  width = 600
) => {
  if (
    !url ||
    typeof url !== "string"
  ) {
    return url;
  }

  if (
    !url.includes(
      "res.cloudinary.com"
    )
  ) {
    return url;
  }

  if (
    !url.includes("/upload/")
  ) {
    return url;
  }

  /*
    Do not duplicate transformations.
  */

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

    images:
      optimizeProductImages(
        variant?.images,
        width
      ),
  }));
};

const optimizeListProducts = (
  products = [],
  width = 600
) => {
  return products.map(
    (product) => ({
      ...product,

      images:
        optimizeProductImages(
          product.images,
          width
        ),
    })
  );
};

/* =========================================================
   SLUG
========================================================= */

const createUniqueSlug = async (
  name,
  currentProductId = null
) => {
  let slug = slugify(
    name || "product",
    {
      lower: true,
      strict: true,
      trim: true,
    }
  );

  if (!slug) {
    slug = `product-${Date.now()}`;
  }

  const query = {
    slug,
  };

  if (
    currentProductId &&
    mongoose.Types.ObjectId.isValid(
      currentProductId
    )
  ) {
    query._id = {
      $ne: currentProductId,
    };
  }

  const existing =
    await Product.findOne(query);

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
};

/* =========================================================
   CREATE PRODUCT
========================================================= */

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

    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Product category is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID",
      });
    }

    const categoryExists =
      await Category.findById(
        category
      );

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    /* -----------------------------
       SIZES
    ----------------------------- */

    const parsedSizes =
      parseProductSizes(sizes);

    /* -----------------------------
       PRODUCT DETAILS
    ----------------------------- */

    const productDetails =
      buildProductDetailsFromRequest(
        req.body
      );

    /* -----------------------------
       COLOR VARIANTS
    ----------------------------- */

    const parsedColorVariants =
      parseColorVariants(
        colorVariants
      );

    /* -----------------------------
       UPLOAD IMAGES
    ----------------------------- */

    const uploadedImages =
      await uploadProductFiles(
        req.files || []
      );

    /* -----------------------------
       BUILD COLOR VARIANTS
    ----------------------------- */

    const finalColorVariants =
      buildColorVariants(
        parsedColorVariants,
        uploadedImages
      );

    /* -----------------------------
       PRODUCT IMAGES
    ----------------------------- */

    let finalImages = [];

    if (
      finalColorVariants.length > 0
    ) {
      finalImages =
        flattenColorImages(
          finalColorVariants
        );
    } else {
      finalImages =
        uploadedImages;
    }

    /* -----------------------------
       SLUG
    ----------------------------- */

    const slug =
      await createUniqueSlug(
        name
      );

    /* -----------------------------
       SKU
    ----------------------------- */

    const sku =
      `SOUK-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    /* -----------------------------
       COLORS
    ----------------------------- */

    let finalColors = [];

    if (
      finalColorVariants.length > 0
    ) {
      finalColors =
        finalColorVariants.map(
          (variant) =>
            variant.name
        );
    } else {
      finalColors =
        parseJson(colors, []);

      if (
        !Array.isArray(finalColors)
      ) {
        finalColors = [];
      }
    }

    /* -----------------------------
       CREATE PRODUCT
    ----------------------------- */

    const product =
      await Product.create({
        name: name.trim(),

        slug,

        description:
          description.trim(),

        productDetails,

        category,

        brand:
          String(
            brand || ""
          ).trim(),

        gender:
          gender || "Unisex",

        price: parseNumber(
          price,
          0
        ),

        discount: parseNumber(
          discount,
          0
        ),

        stock: parseNumber(
          stock,
          0
        ),

        sku,

        sizes: parsedSizes,

        colors: finalColors,

        colorVariants:
          finalColorVariants,

        images: finalImages,
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
      message:
        error.message ||
        "Failed to create product",
    });
  }
};

/* =========================================================
   GET PRODUCTS
========================================================= */

export const getProducts = async (
  req,
  res
) => {
  try {
    const page = Math.max(
      parseInt(
        req.query.page,
        10
      ) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(
          req.query.limit,
          10
        ) || 20,
        1
      ),
      40
    );

    const search =
      typeof req.query.search ===
      "string"
        ? req.query.search.trim()
        : "";

    const category =
      typeof req.query.category ===
      "string"
        ? req.query.category.trim()
        : "";

    const sort =
      typeof req.query.sort ===
      "string"
        ? req.query.sort
        : "featured";

    const skip =
      (page - 1) * limit;

    const filter = {
      isActive: true,
    };

    /* -----------------------------
       CATEGORY
    ----------------------------- */

    if (
      category &&
      category !== "all"
    ) {
      if (
        mongoose.Types.ObjectId.isValid(
          category
        )
      ) {
        filter.category =
          category;
      }
    }

    /* -----------------------------
       SEARCH
    ----------------------------- */

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
          description:
            searchRegex,
        },
        {
          brand: searchRegex,
        },
      ];
    }

    /* -----------------------------
       SORT
    ----------------------------- */

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

    /* -----------------------------
       DATABASE
    ----------------------------- */

    const [
      products,
      total,
    ] = await Promise.all([
      Product.find(filter)
        .select(
          "name slug category price discount stock images featured createdAt averageRating totalReviews"
        )
        .populate(
          "category",
          "name slug"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(
        filter
      ),
    ]);

    const optimizedProducts =
      optimizeListProducts(
        products,
        600
      );

    const totalPages =
      Math.ceil(
        total / limit
      );

    res.set(
      "Cache-Control",
      "public, max-age=10, s-maxage=30, stale-while-revalidate=120"
    );

    return res.status(200).json({
      success: true,

      products:
        optimizedProducts,

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

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

export const getProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    let product = null;

    /* -----------------------------
       FIND BY OBJECT ID
    ----------------------------- */

    if (
      mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      product =
        await Product.findById(
          id
        )
          .populate(
            "category",
            "name slug"
          )
          .lean();
    }

    /* -----------------------------
       FIND BY SLUG
    ----------------------------- */

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
        message:
          "Product not found",
      });
    }

    res.set(
      "Cache-Control",
      "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
    );

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
      message:
        error.message ||
        "Failed to load product",
    });
  }
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct =
  async (req, res) => {
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

      /* -----------------------------
         FIND PRODUCT
      ----------------------------- */

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      /* -----------------------------
         CATEGORY VALIDATION
      ----------------------------- */

      if (category) {
        if (
          !mongoose.Types.ObjectId.isValid(
            category
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid category ID",
          });
        }

        const categoryExists =
          await Category.findById(
            category
          );

        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message:
              "Category not found",
          });
        }
      }

      /* -----------------------------
         SIZES
      ----------------------------- */

      let nextSizes =
        product.sizes || [];

      if (sizes !== undefined) {
        nextSizes =
          parseProductSizes(
            sizes
          );
      }

      /* -----------------------------
         PRODUCT DETAILS
      ----------------------------- */

      const hasProductDetailField =
        PRODUCT_DETAIL_FIELDS.some(
          (field) =>
            req.body[field] !==
            undefined
        ) ||
        req.body.productDetails !==
          undefined ||
        req.body.careInstructions !==
          undefined ||
        req.body.deliveryServices !==
          undefined;

      if (
        hasProductDetailField
      ) {
        product.productDetails =
          buildProductDetailsFromRequest(
            req.body
          );
      }

      /* -----------------------------
         SLUG
      ----------------------------- */

      let nextSlug =
        product.slug;

      if (
        name &&
        name.trim() !==
          product.name
      ) {
        nextSlug =
          await createUniqueSlug(
            name,
            product._id
          );
      }

      /* -----------------------------
         UPLOAD NEW IMAGES
      ----------------------------- */

      const uploadedImages =
        await uploadProductFiles(
          req.files || []
        );

      let nextImages =
        product.images || [];

      let nextColorVariants =
        product.colorVariants || [];

      /* =====================================================
         COLOR VARIANTS WERE SENT
      ===================================================== */

      if (
        colorVariants !==
        undefined
      ) {
        const parsedColorVariants =
          parseColorVariants(
            colorVariants
          );

        nextColorVariants =
          buildColorVariants(
            parsedColorVariants,
            uploadedImages
          );

        nextImages =
          flattenColorImages(
            nextColorVariants
          );

        /*
          Determine which old Cloudinary
          images are no longer being used.
        */

        const oldImages = [
          ...(product.images ||
            []),

          ...flattenColorImages(
            product.colorVariants ||
              []
          ),
        ];

        const retainedIds =
          new Set(
            nextImages
              .map(
                (image) =>
                  image.public_id
              )
              .filter(Boolean)
          );

        const imagesToDelete =
          oldImages.filter(
            (image) =>
              image?.public_id &&
              !retainedIds.has(
                image.public_id
              )
          );

        await deleteCloudinaryImages(
          imagesToDelete
        );
      }

      /* =====================================================
         NO COLOR VARIANTS FIELD
         Legacy/simple image update
      ===================================================== */

      else if (
        uploadedImages.length > 0
      ) {
        nextImages = [
          ...(product.images ||
            []),
          ...uploadedImages,
        ];
      }

      /* -----------------------------
         BASIC DATA
      ----------------------------- */

      if (
        name !== undefined
      ) {
        product.name =
          String(name).trim();
      }

      product.slug =
        nextSlug;

      if (
        description !==
        undefined
      ) {
        product.description =
          String(
            description
          ).trim();
      }

      if (
        category !== undefined
      ) {
        product.category =
          category;
      }

      if (
        brand !== undefined
      ) {
        product.brand =
          String(
            brand
          ).trim();
      }

      if (
        gender !== undefined
      ) {
        product.gender =
          gender;
      }

      if (
        price !== undefined
      ) {
        product.price =
          parseNumber(
            price,
            product.price
          );
      }

      if (
        discount !== undefined
      ) {
        product.discount =
          parseNumber(
            discount,
            product.discount
          );
      }

      if (
        stock !== undefined
      ) {
        product.stock =
          parseNumber(
            stock,
            product.stock
          );
      }

      product.sizes =
        nextSizes;

      product.images =
        nextImages;

      /* -----------------------------
         COLORS
      ----------------------------- */

      if (
        colorVariants !==
        undefined
      ) {
        product.colorVariants =
          nextColorVariants;

        product.colors =
          nextColorVariants.map(
            (variant) =>
              variant.name
          );
      } else if (
        colors !== undefined
      ) {
        const parsedColors =
          parseJson(
            colors,
            []
          );

        product.colors =
          Array.isArray(
            parsedColors
          )
            ? parsedColors
            : [];
      }

      /* -----------------------------
         FEATURED
      ----------------------------- */

      if (
        featured !== undefined
      ) {
        product.featured =
          parseBoolean(
            featured,
            product.featured
          );
      }

      /* -----------------------------
         ACTIVE
      ----------------------------- */

      if (
        isActive !== undefined
      ) {
        product.isActive =
          parseBoolean(
            isActive,
            product.isActive
          );
      }

      /* -----------------------------
         SAVE
      ----------------------------- */

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
        message:
          error.message ||
          "Failed to update product",
      });
    }
  };

/* =========================================================
   DELETE PRODUCT
========================================================= */

export const deleteProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      /* -----------------------------
         DELETE CLOUDINARY IMAGES
      ----------------------------- */

      const allImages = [
        ...(product.images ||
          []),

        ...flattenColorImages(
          product.colorVariants ||
            []
        ),
      ];

      await deleteCloudinaryImages(
        allImages
      );

      /* -----------------------------
         REMOVE FROM CARTS
      ----------------------------- */

      await Cart.updateMany(
        {},
        {
          $pull: {
            items: {
              product:
                product._id,
            },
          },
        }
      );

      /* -----------------------------
         DELETE PRODUCT
      ----------------------------- */

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
        message:
          error.message ||
          "Failed to delete product",
      });
    }
  };

/* =========================================================
   RELATED PRODUCTS
========================================================= */

export const getRelatedProducts =
  async (req, res) => {
    try {
      const {
        categoryId,
        productId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          categoryId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category ID",
        });
      }

      const products =
        await Product.find({
          category: categoryId,

          _id: {
            $ne: productId,
          },

          isActive: true,
        })
          .select(
            "name slug category price discount stock images featured averageRating totalReviews"
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
        message:
          error.message ||
          "Failed to load related products",
      });
    }
  };

/* =========================================================
   BEST SELLERS
========================================================= */

export const getBestSellers =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
        })
          .select(
            "name slug category price discount stock totalSold sizes colors featured averageRating totalReviews images"
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

/* =========================================================
   NEW ARRIVALS
========================================================= */

export const getNewArrivals =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          isActive: true,
        })
          .select(
            "name slug category price discount stock totalSold sizes colors featured averageRating totalReviews images"
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

/* =========================================================
   HOME PAGE SECTIONS
========================================================= */

let homeSectionsCache = null;
let homeSectionsCacheTime = 0;

export const getHomeSections =
  async (req, res) => {
    try {
      const now = Date.now();

      /*
        30 second server-side cache
      */

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
            "name slug category price discount stock totalSold sizes colors featured averageRating totalReviews images"
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
            "name slug category price discount stock totalSold sizes colors featured averageRating totalReviews images"
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

      homeSectionsCacheTime =
        now;

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

/* =========================================================
   DELETE SINGLE PRODUCT IMAGE
========================================================= */

export const deleteProductImage =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const imageId =
        decodeURIComponent(
          req.params.imageId
        );

      const product =
        await Product.findById(
          id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      let imageFound = false;

      let imageToDelete = null;

      /* =====================================================
         SEARCH MAIN PRODUCT IMAGES
      ===================================================== */

      const mainImage =
        (product.images || []).find(
          (image) =>
            image?.public_id ===
            imageId
        );

      if (mainImage) {
        imageFound = true;
        imageToDelete =
          mainImage;
      }

      product.images =
        (product.images || []).filter(
          (image) =>
            image?.public_id !==
            imageId
        );

      /* =====================================================
         SEARCH COLOR VARIANT IMAGES
      ===================================================== */

      product.colorVariants =
        (
          product.colorVariants ||
          []
        ).map((variant) => {
          const matched =
            (
              variant.images ||
              []
            ).find(
              (image) =>
                image?.public_id ===
                imageId
            );

          if (matched) {
            imageFound = true;

            imageToDelete =
              imageToDelete ||
              matched;
          }

          return {
            name: variant.name,

            hex: variant.hex,

            images: (
              variant.images ||
              []
            ).filter(
              (image) =>
                image?.public_id !==
                imageId
            ),
          };
        });

      if (!imageFound) {
        return res.status(404).json({
          success: false,
          message:
            "Image not found",
        });
      }

      /* -----------------------------
         DELETE CLOUDINARY IMAGE
      ----------------------------- */

      if (
        imageToDelete?.public_id
      ) {
        try {
          await cloudinary.uploader.destroy(
            imageToDelete.public_id
          );
        } catch (error) {
          console.error(
            "CLOUDINARY IMAGE DELETE ERROR:",
            error.message
          );
        }
      }

      /* -----------------------------
         REBUILD MAIN IMAGE ARRAY
      ----------------------------- */

      const variantImages =
        flattenColorImages(
          product.colorVariants
        );

      if (
        variantImages.length > 0
      ) {
        product.images =
          variantImages;
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
        message:
          error.message ||
          "Failed to delete product image",
      });
    }
  };