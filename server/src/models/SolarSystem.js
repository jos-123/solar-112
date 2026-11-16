import mongoose from "mongoose";

const solarSystemSchema = new mongoose.Schema({
  mode: { type: String, enum: ["ongrid", "hybrid", "offgrid"], unique: true, required: true },
  label: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  image: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("SolarSystem", solarSystemSchema);
