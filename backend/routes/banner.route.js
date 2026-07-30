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

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getActiveBanners);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get("/all", getAllBanners);

router.get("/:id", getBannerById);

router.post(
  "/",
  upload.array("images", 5),
  createBanner
);

router.put(
  "/:id",
  upload.array("images", 5),
  updateBanner
);

router.delete("/:id", deleteBanner);

export default router;