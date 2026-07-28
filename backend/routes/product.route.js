import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getBestSellers,
  getNewArrivals,
  deleteProductImage,
    
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);

router.get("/", getProducts);

router.get("/best-sellers", getBestSellers);

router.get("/new-arrivals", getNewArrivals);

// IIDDD
router.get("/related/:categoryId/:productId", getRelatedProducts);

router.get("/:id", getProduct);

router.delete("/:id/images/:imageId",deleteProductImage);

router.put("/:id", upload.array("images", 5),updateProduct); 

router.delete("/:id", deleteProduct);


export default router;