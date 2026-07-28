import express from "express";
import {
  placeOrder,
  getUserOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/details/:orderId", protect, getSingleOrder);
router.put("/cancel/:orderId", protect, cancelOrder);

// Admin Routes (we'll add admin middleware later)
router.get("/", protect, getAllOrders);
router.put("/status/:orderId", protect, updateOrderStatus);

export default router;