import { Router } from "express";
import SolarSystem from "../models/SolarSystem.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const defaults = [
  {
    mode: "ongrid", label: "ON-GRID SOLAR SYSTEM",
    title: "Smart Power. Maximum Savings.",
    description: "An on-grid solar system connects solar panels to the electricity grid. Solar power can supply your property and excess electricity may be exported under applicable local net-metering rules. Standard grid-tied systems generally shut down during a grid outage unless designed with approved backup capability.",
    features: ["No battery required in a standard setup", "Can reduce grid electricity consumption", "Net metering subject to local rules"],
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900",
    active: true
  },
  {
    mode: "hybrid", label: "HYBRID SOLAR SYSTEM",
    title: "The Ultimate Balance",
    description: "A hybrid solar system combines solar panels, battery storage and grid connectivity. Solar power can serve loads, charge the battery and use the grid when needed. Backup availability depends on inverter design and installation.",
    features: ["Solar generation for daily use", "Battery storage for backup", "Grid support when required"],
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900",
    active: true
  },
  {
    mode: "offgrid", label: "OFF-GRID SOLAR SYSTEM",
    title: "Independent Energy",
    description: "An off-grid solar system operates without a utility-grid connection. Solar panels charge batteries and the system supplies the property from solar generation and stored energy. System sizing must account for night-time use and cloudy weather.",
    features: ["No utility-grid connection required", "Battery storage is essential", "Useful for remote locations"],
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=900",
    active: true
  }
];

router.get("/", async (_req, res, next) => {
  try {
    const existing = await SolarSystem.find();
    if (existing.length === 0) await SolarSystem.insertMany(defaults);
    const systems = await SolarSystem.find({ active: true }).sort({ mode: 1 });
    res.json(systems);
  } catch (error) { next(error); }
});

router.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try {
    const existing = await SolarSystem.find();
    if (existing.length === 0) await SolarSystem.insertMany(defaults);
    res.json(await SolarSystem.find().sort({ mode: 1 }));
  } catch (error) { next(error); }
});

router.put("/:mode", requireAdmin, async (req, res, next) => {
  try {
    if (!["ongrid", "hybrid", "offgrid"].includes(req.params.mode)) {
      return res.status(400).json({ message: "Invalid solar system mode." });
    }
    const system = await SolarSystem.findOneAndUpdate(
      { mode: req.params.mode }, req.body,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(system);
  } catch (error) { next(error); }
});

export default router;
