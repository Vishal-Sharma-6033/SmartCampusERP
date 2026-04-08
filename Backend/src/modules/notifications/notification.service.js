import Notification from "./notification.model.js";
import { getIO } from "../../sockets/socket.js"; 
// export const createNotification = async ({
//   userId,
//   userIds,
//   title,
//   message,
//   type = "general",
// }) => {
  
//   if (userIds && userIds.length > 0) {
//     const data = userIds.map((id) => ({
//       userId: id,
//       title,
//       message,
//       type,
//     }));

//     return await Notification.insertMany(data);
//   }
//   return await Notification.create({
//     userId,
//     title,
//     message,
//     type,
//   });
// };



export const createNotification = async ({
  userId,
  userIds,
  title,
  message,
  type = "general",
}) => {
  const io = getIO(); // 🔥 socket instance

  // ✅ MULTIPLE USERS
  if (userIds && userIds.length > 0) {
    const data = userIds.map((id) => ({
      userId: id,
      title,
      message,
      type,
    }));

    const notifications = await Notification.insertMany(data);

    // 🔥 REAL-TIME EMIT (MULTIPLE)
    userIds.forEach((id) => {
      io.to(id.toString()).emit("notification", {
        title,
        message,
        type,
      });
    });

    return notifications;
  }

  // ✅ SINGLE USER
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
  });

  // 🔥 REAL-TIME EMIT (SINGLE)
  io.to(userId.toString()).emit("notification", {
    id: notification._id,
    title,
    message,
    type,
    createdAt: notification.createdAt,
  });

  return notification;
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 4cdd07dbacf2981a6e1b4c0a38503635040b7d31
