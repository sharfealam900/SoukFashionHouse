import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import reviewRoutes from "./routes/review.route.js";
import adminRoutes from "./routes/adminRoutes.js";
import couponRoutes from "./routes/coupon.route.js";
import subscriberRoutes from "./routes/subscriber.routes.js";
import bannerRoutes from "./routes/banner.route.js";
import contactRoutes from "./routes/contact.routes.js";
import paymentRoutes from "./routes/payment.route.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://souk-fashion-house-intk.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Souk Fashion House API Running",
  });
});

// Your routes...

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/admin", (req, res, next) => {
  console.log("✅ Admin route reached:", req.method, req.originalUrl);next();});

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/coupons", couponRoutes);

 app.use("/api/v1/subscribers", subscriberRoutes);

 app.use("/api/v1/banners", bannerRoutes);

 app.use("/api/v1/contact", contactRoutes);

 app.use("/api/v1/payment", paymentRoutes);

export default app;