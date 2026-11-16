import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, enum: ["solar", "battery", "inverter"], required: true },
  batteryType: { type: String, enum: ["four-wheeler","two-wheeler","commercial","power-backup"], default: "power-backup" },
  brand: { type: String, trim: true, default: "" },
  description: { type: String, required: true, maxlength: 2000 },
  price: { type: Number, min: 0, default: null },
  image: { type: String, default: "" },
  specifications: [{ type: String, trim: true }],
  available: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("Product", productSchema);
