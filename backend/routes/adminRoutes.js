import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

import { getCategorySales, getDashboardStats, getLowStockProducts, getNotifications, getOrderAnalytics, getRevenueAnalytics, getTopProducts } from "../controllers/adminController.js";

import {getAllOrders,updateOrderStatus,} from "../controllers/order.controller.js";

const router = express.Router();


router.get( "/dashboard",protect,isAdmin,getDashboardStats);

router.get("/orders",protect,isAdmin,getAllOrders);

router.put("/orders/:orderId",protect,isAdmin,updateOrderStatus);

router.get("/analytics/revenue",protect,isAdmin, getRevenueAnalytics);

router.get("/analytics/orders",protect,isAdmin,getOrderAnalytics);

router.get("/analytics/top-products",protect,isAdmin,getTopProducts);

router.get("/analytics/low-stock",protect,isAdmin,getLowStockProducts);

router.get("/analytics/category-sales", protect,isAdmin,getCategorySales);


router.get("/analytics/notifications",protect,isAdmin, getNotifications);

export default router;