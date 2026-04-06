import Notification from "./notification.model.js";

export const createNotification = async ({
  userId,
  userIds,
  title,
  message,
  type = "general",
}) => {
  
  if (userIds && userIds.length > 0) {
    const data = userIds.map((id) => ({
      userId: id,
      title,
      message,
      type,
    }));

    return await Notification.insertMany(data);
  }
  return await Notification.create({
    userId,
    title,
    message,
    type,
  });
};

export const getNotifications = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Notification.countDocuments({ userId });

  return {
    notifications,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const markOneAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true },
  );
};
