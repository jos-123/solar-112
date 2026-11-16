import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
 title:{type:String,required:true,trim:true},
 location:{type:String,default:"Kerala"},
 capacity:{type:String,default:""},
 description:{type:String,default:""},
 image:{type:String,required:true},
 active:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model("Project",projectSchema);
