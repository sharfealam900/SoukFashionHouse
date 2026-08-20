import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import {
  protect,
  isAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();



// Get all categories
router.get("/", getCategories);

// Get single category
router.get("/:id", getCategory);



// Create category
router.post( "/",protect,isAdmin,createCategory);

// Update category
router.put("/:id", protect, isAdmin, updateCategory);

// Delete category
router.delete("/:id", protect,isAdmin,deleteCategory);

export default router;