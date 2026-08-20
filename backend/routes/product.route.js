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
  deleteProductImage,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.middleware.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();


// Get all products
router.get("/", getProducts);

// Get best sellers
router.get("/best-sellers", getBestSellers);

// Get new arrivals
router.get("/new-arrivals", getNewArrivals);

// Get related products
router.get("/related/:categoryId/:productId", getRelatedProducts);

// Get single product
router.get("/:id", getProduct);

// Create product
router.post("/", protect, isAdmin, upload.array("images", 5),createProduct);

// Update product
router.put( "/:id", protect, isAdmin, upload.array("images", 5), updateProduct);

// Delete product image
router.delete( "/:id/images/:imageId", protect, isAdmin, deleteProductImage);

// Delete product
router.delete( "/:id", protect, isAdmin, deleteProduct);

export default router;