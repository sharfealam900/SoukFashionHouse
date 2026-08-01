import express from "express";
import {
  placeOrder,
  getUserOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderReport,
  exportOrdersExcel,
} from "../controllers/order.controller.js";


import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/details/:orderId", protect, getSingleOrder);
router.put("/cancel/:orderId", protect, cancelOrder);

// Admin Routes (we'll add admin middleware later)
router.get("/", protect, isAdmin, getAllOrders);
router.put("/status/:orderId", protect, isAdmin, updateOrderStatus);
router.get("/admin/report",protect,isAdmin,getOrderReport);
router.get("/admin/export/excel",protect, isAdmin, exportOrdersExcel);

export default router;