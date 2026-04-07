import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import {globalSearch, saveSearch, getRecentSearches } from "./search.service.js";


export const search = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const results = await globalSearch(
    q,
    Number(page) || 1,
    Number(limit) || 10
  );

  // 🔥 Save user search
  await saveSearch(req.user?.id, q);

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Search results fetched"));
});

export const recentSearches = asyncHandler(async (req, res) => {
  const data = await getRecentSearches(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Recent searches fetched"));
});