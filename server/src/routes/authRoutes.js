import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email, role: "admin" });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid administrator email or password." });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token, admin: { name: user.name, email: user.email, role: "admin" } });
  } catch (error) { next(error); }
});


// Customer registration: separate from administrator access.
router.post("/customer/register", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "An account with this email already exists. Please log in." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: "customer" });
    const token = jwt.sign({ id: user._id.toString(), role: "customer", name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (error) { next(error); }
});

router.post("/customer/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email, role: "customer" });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Invalid customer email or password." });
    const token = jwt.sign({ id: user._id.toString(), role: "customer", name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) { next(error); }
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: { name: req.admin.name, id: req.admin.id } });
});

export default router;
