import express from "express";
import {addToCart,getCart,updateCartItem,removeCartItem, clearCart,
} from "../controllers/cart.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/", protect, updateCartItem);

router.delete("/", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

export default router;