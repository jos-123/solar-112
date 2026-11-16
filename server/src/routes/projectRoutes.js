import {Router} from "express";
import Project from "../models/Project.js";
import {requireAdmin} from "../middleware/auth.js";
const router=Router();
router.get("/",async(_req,res,next)=>{try{
 if(await Project.countDocuments()===0) await Project.insertMany([
  {title:"Residential rooftop installation",location:"Sample location, Kerala",capacity:"3 kW sample",description:"Replace with a real completed HAIL MARY project.",image:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200"},
  {title:"Commercial solar project",location:"Sample location, Kerala",capacity:"10 kW sample",description:"Replace with a real completed HAIL MARY project.",image:"https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200"},
  {title:"Hybrid solar installation",location:"Sample location, Kerala",capacity:"5 kW sample",description:"Replace with a real completed HAIL MARY project.",image:"https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200"}
 ]);
 res.json(await Project.find({active:true}).sort({createdAt:-1}));
}catch(e){next(e);}});
router.get("/admin/all",requireAdmin,async(_req,res,next)=>{try{res.json(await Project.find().sort({createdAt:-1}));}catch(e){next(e);}});
router.post("/",requireAdmin,async(req,res,next)=>{try{res.status(201).json(await Project.create(req.body));}catch(e){next(e);}});
router.put("/:id",requireAdmin,async(req,res,next)=>{try{const p=await Project.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!p)return res.status(404).json({message:"Project not found"});res.json(p);}catch(e){next(e);}});
router.delete("/:id",requireAdmin,async(req,res,next)=>{try{const p=await Project.findByIdAndDelete(req.params.id);if(!p)return res.status(404).json({message:"Project not found"});res.json({message:"Project deleted"});}catch(e){next(e);}});
export default router;
