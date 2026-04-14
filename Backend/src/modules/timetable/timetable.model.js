import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
    className :{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    day:{
        type:String,
        enum : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required:true
    },
    periods:[
        {
        subject: { type: String, required: true },
        teacher: { type: String },
        startTime: { type: String, required: true }, 
        endTime: { type: String, required: true },   
      },
    ],
}, {timestamps:true});

export default mongoose.model('Timetable', timetableSchema);