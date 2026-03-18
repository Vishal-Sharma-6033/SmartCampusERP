import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './config/db.js';

dotenv.config()

// DataBase Connected
connectDb()

const PORT = process.env.PORT || 6000;

app.listen(PORT, ()=>{
    console.log(`🚀 Server running on port ${PORT}`);

})