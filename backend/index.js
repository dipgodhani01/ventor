import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import userRoutes from "./routes/user.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

await connectDB();
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.log("Missing Redis URL");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => console.log("Connected to redis"))
  .catch(() => console.error);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
      "x-xsrf-token",
      "csrf-token",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("/api/v1", adminRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
