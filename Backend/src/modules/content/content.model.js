import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },

  description:String,

  type: {
    type:String,
    enum:["note","video","pdf","syllabus","image"]
  },

  subjectId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Subject",
    required:true
  },

  semester:Number,

  fileUrl:{
    type:String,
    required:true
  },

  publicId:String,

  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  tags:[String],

  view:{
    type:Number,
    default:0
  },
  download:{
    type:Number,
    default:0
  },

  isPublished:{
    type:Boolean,
    default:true
  },
},{timestamps:true}
);

export default mongoose.model("Content", contentSchema)