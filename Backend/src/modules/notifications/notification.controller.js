

import * as service from "./notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";


/**
 * GET /api/notifications
 */
export const getMyNotifications = asyncHandler(async (req, res) => {

  const data = await service.getNotifications(req.user._id, req.query);
  const unread = await service.getUnreadCount(req.user._id);

  res.json(new ApiResponse(200, {
    ...data,
    unreadCount: unread
  }));
});


/**
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {

  const notif = await service.markOneAsRead(req.params.id);

  res.json(new ApiResponse(200, notif));
});




/**
 * POST /api/notifications (🔥 CREATE)
 */
export const createNotification = asyncHandler(async (req, res) => {

  const { userId, userIds, title, message, type } = req.body;

  if (!title || !message) {
    throw new Error("Title & message required");
  }

  const data = await service.createNotification({
    userId,
    userIds,
    title,
    message,
    type
  });

  res.json(new ApiResponse(201, data, "Notification created"));
});