import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})); // to parse JSON bodies
app.use(express.urlencoded({extended:true,limit:"16kb"}));  // to parse URL-encoded bodies
app.use(express.static("public"));  // to serve static files from 'public' directory
app.use(cookieParser()); // to parse cookies


 
export { app } 