import dotenv from "dotenv";
import connectToDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
});

connectToDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
    app.on("error",(error)=>{
            console.error("Error in Express app:",error);
            throw error;
        })
})
.catch((err)=>{
    console.log("Error in connecting to DB:",err)
})











/*
import express from "express";
const app=express();

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("Connected to MongoDB successfully");
        app.on("error",(error)=>{
            console.error("Error in Express app:",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})()
*/