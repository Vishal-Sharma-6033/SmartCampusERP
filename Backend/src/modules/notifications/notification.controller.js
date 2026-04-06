import Notification from "./notification.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const data = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, data));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  res.json(new ApiResponse(200, notif));
});