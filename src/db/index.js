import mongoose from "mongoose";

import {DB_NAME} from "../constants.js";

export const connectToDB=async()=>{
    try {
       const ConnectInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n Connected to MongoDB database: ${ConnectInstance.connection.host} successfully`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}


export default connectToDB;