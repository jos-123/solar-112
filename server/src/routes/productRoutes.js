import { Router } from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
const samples = [
 {name:"Amaron 45Ah Car Battery",category:"battery",batteryType:"four-wheeler",brand:"Amaron (sample)",description:"Sample car battery listing. Confirm exact fitment and warranty before purchase.",price:6500,image:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900",specifications:["12V","45Ah (sample specification)","Fitment confirmation required"],available:true},
 {name:"Exide 12V Two-Wheeler Battery",category:"battery",batteryType:"two-wheeler",brand:"Exide (sample)",description:"Sample two-wheeler battery listing. Select the correct model for your vehicle.",price:1800,image:"https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900",specifications:["12V (sample)","Vehicle compatibility check required"],available:true},
 {name:"Commercial Vehicle Battery",category:"battery",batteryType:"commercial",brand:"HAIL MARY selection",description:"Sample heavy-duty battery listing for commercial vehicle enquiries.",price:12500,image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900",specifications:["Heavy-duty category","Confirm capacity and dimensions"],available:true},
 {name:"Home Power Backup Battery",category:"battery",batteryType:"power-backup",brand:"Luminous (sample)",description:"Sample power backup battery for inverter applications. Final sizing depends on load and backup hours.",price:14500,image:"https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900",specifications:["12V (sample)","Capacity selection based on load"],available:true},
 {name:"Pure Sine Wave Solar Inverter",category:"inverter",brand:"Sample model",description:"Sample inverter listing. Contact us to confirm capacity, phase and compatibility.",price:28000,image:"https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=900",specifications:["Pure sine wave (sample)","Capacity to be confirmed"],available:true},
 {name:"Mono PERC Solar Panel",category:"solar",brand:"Sample model",description:"Sample solar panel listing. Confirm wattage, dimensions and warranty from the final datasheet.",price:8500,image:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900",specifications:["Mono PERC (sample)","Rated wattage to be confirmed"],available:true}
];
router.get("/", async (req,res,next)=>{
 try {
  if(await Product.countDocuments()===0) await Product.insertMany(samples);
  const filter={available:true};
  if(["solar","battery","inverter"].includes(req.query.category)) filter.category=req.query.category;
  res.json(await Product.find(filter).sort({createdAt:-1}));
 } catch(e){next(e);}
});
router.get("/admin/all",requireAdmin,async(_req,res,next)=>{try{res.json(await Product.find().sort({createdAt:-1}));}catch(e){next(e);}});
router.post("/",requireAdmin,async(req,res,next)=>{try{res.status(201).json(await Product.create(req.body));}catch(e){next(e);}});
router.put("/:id",requireAdmin,async(req,res,next)=>{try{const p=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!p)return res.status(404).json({message:"Product not found."});res.json(p);}catch(e){next(e);}});
router.delete("/:id",requireAdmin,async(req,res,next)=>{try{const p=await Product.findByIdAndDelete(req.params.id);if(!p)return res.status(404).json({message:"Product not found."});res.json({message:"Product deleted."});}catch(e){next(e);}});
export default router;
