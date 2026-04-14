import * as noticeService from "./notice.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createNotice = asyncHandler(async (req, res) => {
  const notice = await noticeService.createNotice({
    ...req.body,
    createdBy: req.user?._id,
  });

  res.json(new ApiResponse(201, notice, "Notice created"));
});

export const getNotices = asyncHandler(async (req, res) => {
  const notices = await noticeService.getNotices(req.query);

  res.json(new ApiResponse(200, notices));
});

export const getEvents = asyncHandler(async (req, res) => {
  const events = await noticeService.getCalendarEvents();

  res.json(new ApiResponse(200, events));
});