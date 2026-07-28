import express from "express";

import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/:productId", getProductReviews);

// Protected
router.post("/", protect, createReview);

router.put("/:id", protect, updateReview);

router.delete("/:id", protect, deleteReview);

export default router;