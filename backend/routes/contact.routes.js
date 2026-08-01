import express from "express";

import {
  sendMessage,
  getAllMessages,
  getSingleMessage,
  updateStatus,
  replyMessage,
  deleteMessage,
} from "../controllers/contact.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* ==========================
   CUSTOMER
========================== */

router.post("/", sendMessage);

/* ==========================
   ADMIN
========================== */

router.get(
  "/admin",
  protect,
  isAdmin,
  getAllMessages
);

router.get(
  "/admin/:id",
  protect,
  isAdmin,
  getSingleMessage
);

router.patch(
  "/admin/status/:id",
  protect,
  isAdmin,
  updateStatus
);

router.patch(
  "/admin/reply/:id",
  protect,
  isAdmin,
  replyMessage
);

router.delete(
  "/admin/:id",
  protect,
  isAdmin,
  deleteMessage
);

export default router;