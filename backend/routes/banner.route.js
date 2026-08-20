import express from "express";

import {
  createBanner,
  getActiveBanners,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

import upload from "../middleware/upload.middleware.js";

import {
  protect,
  isAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();



// Get active banners for website
router.get("/", getActiveBanners);

// Get all banners
router.get("/all", protect,isAdmin,getAllBanners);

// Get banner by ID
router.get("/:id",protect,isAdmin,getBannerById);

// Create banner
router.post("/", protect, isAdmin, upload.array("images", 5), createBanner);

// Update banner
router.put("/:id",protect,isAdmin, upload.array("images", 5), updateBanner);

// Delete banner
router.delete("/:id", protect, isAdmin, deleteBanner);

export default router;