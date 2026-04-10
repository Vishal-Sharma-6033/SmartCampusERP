import asyncHandler from "../../utils/asyncHandler.js";
import * as aiService from "./ai.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

//  Chatbot
export const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const response = await aiService.generateChatResponse(message);

  res.json(new ApiResponse(200, response, "AI response generated"));
});

export const getStudentPerformance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const data = await aiService.analyzePerformance(studentId);

  res.json(new ApiResponse(200, data, "Performance analyzed"));
});