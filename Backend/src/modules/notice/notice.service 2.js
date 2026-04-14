import Notice from "./notice.model.js";

export const createNotice = async (data) => {
  return await Notice.create(data);
};

export const getNotices = async (query) => {
  const { year, month, type } = query;

  let filter = {};

  // 📅 Month/Year filtering
  if (year && month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    filter.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  // 📌 Type filtering (notice/event)
  if (type) {
    filter.type = type;
  }

  return await Notice.find(filter)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email");
};

export const getCalendarEvents = async () => {
  return await Notice.find({ type: "event" }).select(
    "title eventDate description"
  );
};