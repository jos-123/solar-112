import { Router } from "express";
import NewArrival from "../models/NewArrival.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const item = await NewArrival.findOne().sort({ updatedAt: -1 });
    res.json(item || { eyebrow: "NEW ARRIVAL", title: "Discover our latest solar solutions", description: "Explore our latest products and offers from HAIL MARY Solar Solutions.", images: [], whatsappMessage: "Hello HAIL MARY, I would like to enquire about your new arrival.", active: false });
  } catch (error) { next(error); }
});

router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const images = Array.isArray(req.body.images) ? req.body.images.map(x => String(x).trim()).filter(Boolean).slice(0, 3) : [];
    const payload = {
      eyebrow: String(req.body.eyebrow || "NEW ARRIVAL").trim(),
      title: String(req.body.title || "").trim(),
      description: String(req.body.description || "").trim(),
      images,
      whatsappMessage: String(req.body.whatsappMessage || "Hello HAIL MARY, I would like to enquire about your new arrival.").trim(),
      active: Boolean(req.body.active)
    };
    const current = await NewArrival.findOne().sort({ updatedAt: -1 });
    const saved = current
      ? await NewArrival.findByIdAndUpdate(current._id, payload, { new: true, runValidators: true })
      : await NewArrival.create(payload);
    res.json(saved);
  } catch (error) { next(error); }
});
export default router;
