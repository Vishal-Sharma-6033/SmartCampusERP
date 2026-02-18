import mongoose,{ Schema } from "mongoose";

const studentSchema=new mongoose.Schema({
    rollNumber:{
        type:String,
        required:true,
        unique:true
    },
    department:{
        type:String,
        required:true
    },
    yearOfStudy:{
        type:Number,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    semester:{
        type:Number,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    courcesEnrolled:[
        {
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    attendancePercentage:{
        type:Number,
        default:0
    }
},{timestamps:true});

export const Student=mongoose.model("Student",studentSchema);