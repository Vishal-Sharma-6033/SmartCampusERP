import { ApiError } from "../utils/ApiErrors.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {User} from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const genrateAccessToken= asyncHandler(async(userId)=>{
    try {
        const user= await User.findById(userId);
        if(!user){
            throw new ApiError(500,"User not found")
        }

        const accessToken=user.generateAccessToken();
        const refressToken=user.generateRefreshtoken();
        console.log("Access Token:-",accessToken)
        console.log("Refress Token:-",refressToken)
        user.refressToken=refressToken
        await user.save({validateBeforeSave:false})

        return {refressToken,accessToken}

        
    } catch (err) {
        console.log("Tocken Err:-",err)
        throw new ApiError(500,"Error genrating access token")
    }
})

const registerUser=asyncHandler(async(req,res)=>{
    const {Name, Email, Password, Role}= req.body;

    if(!Name || !Email || !Password || !Role){
        throw new ApiError(400,"All fields are required")
    }
    const existingUser= await User.findOne({$or:[{Email}, {Password}]})
    if(existingUser){
        throw new ApiError(400,"User with this email or password already exists")
    }

let ProfileImagelocalPath;
  if (
    req.files &&
    Array.isArray(req.files.ProfileImage) &&
    req.files.ProfileImage.length > 0
  ) {
    ProfileImagelocalPath = req.files.ProfileImage[0].path;
  }

  if(!ProfileImagelocalPath){
    throw new ApiError(400,"Profile image is required")
  }

    const profileImage= await uploadOnCloudinary(ProfileImagelocalPath)

    if(!profileImage){
        throw new ApiError(500,"Error uploading profile image")
    }

    const newUser= await User.create({
        Name,
        Email,
        Password,
        Role,
        ProfileImage:profileImage.url
    })
    
    const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));

})



export {genrateAccessToken,registerUser}