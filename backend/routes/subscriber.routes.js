import express from "express";

import {
  subscribe,
  getSubscribers,
  deleteSubscriber,
  exportSubscribers,
} from "../controllers/subscriber.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";



const router = express.Router();

/* ============================
   PUBLIC
============================ */

// Subscribe to newsletter
router.post("/", subscribe);

/* ============================
   ADMIN
============================ */

// Get all subscribers
router.get("/", protect, isAdmin, getSubscribers);

// Export subscribers CSV
router.get("/export", protect, isAdmin, exportSubscribers);

// Delete subscriber
router.delete("/:id", protect, isAdmin, deleteSubscriber);

export default router;