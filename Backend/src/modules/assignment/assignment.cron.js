import cron from "node-cron";
import Assignment from "./assignment.model.js";
import Submission from "./submission.model.js";
import Notification from "../notifications/notification.model.js";
import User from "../user/user.model.js";

cron.schedule("0 9 * * *", async () => {
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);

  const assignments = await Assignment.find({
    deadline: { $lte: nextDay },
  });

  for (const assignment of assignments) {
    const students = await User.find({ role: "student" });

    for (const student of students) {
      const submitted = await Submission.findOne({
        assignmentId: assignment._id,
        studentId: student._id,
      });

      if (!submitted) {
        await Notification.create({
          userId: student._id,
          title: "Reminder",
          message: `Submit ${assignment.title} before deadline`,
        });
      }
    }
  }

  console.log("Reminder cron ran");
});