// import * as service from "./notification.service.js";
// import asyncHandler from "../../utils/asyncHandler.js";
// import ApiResponse from "../../utils/ApiResponse.js";


// export const getMyNotifications = asyncHandler(async (req, res) => {

//   const data = await service.getNotifications(req.user._id, req.query);
//   const unread = await service.getUnreadCount(req.user._id);

//   res.json(new ApiResponse(200, {
//     ...data,
//     unreadCount: unread
//   }));
// });

// export const markAsRead = asyncHandler(async (req, res) => {

//   const notif = await service.markOneAsRead(req.params.id);

//   res.json(new ApiResponse(200, notif));
// });

// export const createNotification = asyncHandler(async (req, res) => {

//   const { userId, userIds, title, message, type } = req.body;

//   if (!title || !message) {
//     throw new Error("Title & message required");
//   }

//   const data = await service.createNotification({
//     userId,
//     userIds,
//     title,
//     message,
//     type
//   });

//   res.json(new ApiResponse(201, data, "Notification created"));
// });
import * as service from "./notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

/**
 * 📌 Get My Notifications (with pagination + unread count)
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await service.getNotifications(userId, req.query);
  // const unreadCount = await service.getUnreadCount(userId);

  return res.status(200).json(
    new ApiResponse(200, {
      ...data,
      // unreadCount,
    })
  );
});

/**
 * 📌 Mark Single Notification as Read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  if (!notificationId) {
    throw new ApiError(400, "Notification ID is required");
  }

  const notif = await service.markOneAsRead(notificationId);

  if (!notif) {
    throw new ApiError(404, "Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(200, notif, "Marked as read")
  );
});

/**
 * 📌 Create Notification (Single / Bulk)
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { userId, userIds, title, message, type } = req.body;

  // ✅ Validation
  if (!title || !message) {
    throw new ApiError(400, "Title & message are required");
  }

  if (!userId && (!userIds || userIds.length === 0)) {
    throw new ApiError(400, "Provide userId or userIds");
  }

  // ✅ Create notification
  const data = await service.createNotification({
    userId,
    userIds,
    title,
    message,
    type: type || "general",
  });

  return res.status(201).json(
    new ApiResponse(201, data, "Notification created successfully")
  );
});