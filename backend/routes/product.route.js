import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getBestSellers,
  getNewArrivals,
  getHomeSections,
  deleteProductImage,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.middleware.js";
import {
  protect,
  isAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/home-sections",
  getHomeSections
);

router.get(
  "/best-sellers",
  getBestSellers
);

router.get(
  "/new-arrivals",
  getNewArrivals
);

router.get(
  "/related/:categoryId/:productId",
  getRelatedProducts
);

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProduct
);

router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id/images/:imageId",
  protect,
  isAdmin,
  deleteProductImage
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteProduct
);

export default router;