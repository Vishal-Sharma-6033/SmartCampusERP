import mongoose from 'mongoose';

const connectDb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Database connected: ${conn.connection.host}`)

    }
    catch(err){
        console.error("Database connection failed",err.message)
        process.exit(1)
    }
}

export default connectDb;