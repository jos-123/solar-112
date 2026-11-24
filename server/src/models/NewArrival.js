import mongoose from "mongoose";
const schema = new mongoose.Schema({
  eyebrow: { type: String, default: "NEW ARRIVAL" },
  title: { type: String, default: "Discover our latest solar solutions" },
  description: { type: String, default: "Explore our latest products and offers from HAIL MARY Solar Solutions." },
  images: { type: [String], default: [] },
  whatsappMessage: { type: String, default: "Hello HAIL MARY, I would like to enquire about your new arrival." },
  active: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("NewArrival", schema);
