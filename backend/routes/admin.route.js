import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin router is working",
  });
});
router.get("/", protect, isAdmin, getAllOrders);

router.put(
  "/status/:orderId",
  protect,
  isAdmin,
  updateOrderStatus
);

export default router;