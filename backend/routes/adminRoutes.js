import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

import { getDashboardStats } from "../controllers/adminController.js";

import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

/* Dashboard */
router.get(
  "/dashboard",
  protect,
  isAdmin,
  getDashboardStats
);

/* Orders */
router.get(
  "/orders",
  protect,
  isAdmin,
  getAllOrders
);

router.put(
  "/orders/:orderId",
  protect,
  isAdmin,
  updateOrderStatus
);

export default router;