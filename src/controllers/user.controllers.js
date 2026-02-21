import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(500, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (err) {
    console.log("Token Error:", err);
    throw new ApiError(500, "Error generating access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { Name, Email, Password, Role } = req.body;

  if (!Name || !Email || !Password || !Role) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ $or: [{ Email }, { Password }] });
  if (existingUser) {
    throw new ApiError(400, "User with this email or password already exists");
  }

  let ProfileImagelocalPath;
  if (
    req.files &&
    Array.isArray(req.files.ProfileImage) &&
    req.files.ProfileImage.length > 0
  ) {
    ProfileImagelocalPath = req.files.ProfileImage[0].path;
  }

  if (!ProfileImagelocalPath) {
    throw new ApiError(400, "Profile image is required");
  }

  const profileImage = await uploadOnCloudinary(ProfileImagelocalPath);

  if (!profileImage) {
    throw new ApiError(500, "Error uploading profile image");
  }

  const newUser = await User.create({
    Name,
    Email,
    Password,
    Role,
    ProfileImage: profileImage.url,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ Email });
  if (!user) {
    throw new ApiError(400, "User with this email or password does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(Password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } =
  await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-Password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { refreshToken, user: loggedInUser },
      "User logged in successfully"
    )
  );

});

const logoutUser= asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,{
      refreshToken:undefined
    },
    {
      new:true
    }
  )
  const options={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken", "", options)
  .cookie("refreshToken", "", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies?.refreshToken || req.body.refreshToken;
  
  if(!incomingRefreshToken){
    throw new ApiError(401,"Refresh token is missing");
  }
  const decoded=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

  const user =await User.findById(decoded._id);

  if(!user){
    throw new ApiError(401,"User not found");
  }
  if(incomingRefreshToken!==user.refreshToken){
    throw new ApiError(401,"Invalid refresh token");
  }
  const options={
    httpOnly:true,
    secure:true
  }
  const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new ApiResponse(200,{accessToken,refreshToken},"Access token refreshed successfully"));

})



export { registerUser, loginUser , logoutUser, refreshAccessToken};
