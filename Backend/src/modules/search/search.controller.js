import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { globalSearch } from './search.service.js';

export const search = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw new Error("Search query is required");
  }

  const results = await globalSearch(q, Number(page) || 1, Number(limit) || 10);

  return res.status(200).json(
    new ApiResponse(200, results, "Search results fetched successfully")
  );
});