import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.post("/", protect, isAdmin, createCoupon);

router.get("/", protect, isAdmin, getAllCoupons);

router.post("/apply", protect, applyCoupon);

router.get("/:id", protect, isAdmin, getCouponById);

router.put("/:id", protect, isAdmin, updateCoupon);

router.delete("/:id", protect, isAdmin, deleteCoupon);

export default router;