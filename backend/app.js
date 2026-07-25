import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Souk Fashion House API Running"
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);

export default app;