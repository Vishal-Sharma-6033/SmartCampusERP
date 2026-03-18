import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';
import errorHandler from './shared/middlewares/error.middleware.js';
import morganMiddleware from './shared/middlewares/logger.middleware.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(morganMiddleware)

app.use("/api/v1", routes)
// check route 
app.get("/", (req,res)=>{
    res.send("Smart Campus ERP Running.....")
})

//Error handler (always in last)
app.use(errorHandler)

export default app;
