import ApiError from "../../core/ApiError.js";

const errorHandler = (err,req,res,next)=>{
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success:false,
            message:err.message
        })
    }
    return res.status(500).json({
        success:false,
        message:err.message || "Internal Server Error....."
    })
}
export default errorHandler;