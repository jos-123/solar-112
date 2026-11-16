import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import systemRoutes from "./src/routes/systemRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import User from "./src/models/User.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
const app = express();
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((value) => value.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error("This website origin is not allowed by the API CORS settings."));
} }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "HAIL MARY Solar API" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/systems", systemRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reviews", reviewRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET must be configured in server/.env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Keep the configured administrator credentials in sync with server/.env.
  // This fixes stale admin passwords from earlier development runs.
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in server/.env");
  }
  const existingWithEmail = await User.findOne({ email });
  if (existingWithEmail && existingWithEmail.role !== "admin") {
    throw new Error(`The configured admin email ${email} is already registered as a customer. Set a different ADMIN_EMAIL in server/.env.`);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email, role: "admin" },
    { $set: { name: process.env.ADMIN_NAME || "Administrator", email, passwordHash, role: "admin" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Administrator credentials ready: ${email}`);

  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
}

start().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
