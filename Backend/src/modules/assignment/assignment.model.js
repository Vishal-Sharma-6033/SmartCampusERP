import mongoose, { mongo } from 'mongoose'

const assignmentSchema = new mongoose.Schema({
    title:String,
    description:String,

    subjectId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Subject"
    },
    teracherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    deadline:Date,
    totalMarks:Number,

}, {timestamps:true})
assignmentSchema.index({ title: 'text', description: 'text' });
export default mongoose.model("Assignment", assignmentSchema)