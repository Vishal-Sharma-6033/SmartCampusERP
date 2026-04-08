import * as aiService from "./ai.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

// CHATBOT
export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const reply = await aiService.chatWithAI(message, req.user);

  res.json(new ApiResponse(200, reply, "AI response generated"));
});