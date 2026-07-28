import express from "express";


import { protect } from "../middleware/auth.middleware.js";
import { addToWishlist, clearWishlist, getWishlist, removeWishlistItem } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/", protect, addToWishlist);

router.get("/", protect, getWishlist);

router.delete("/:productId", protect, removeWishlistItem);

router.delete("/", protect, clearWishlist);

export default router;