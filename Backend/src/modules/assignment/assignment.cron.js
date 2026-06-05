import cron from "node-cron";
import Assignment from "./assignment.model.js";
import Submission from "./submission.model.js";
import Notification from "../notifications/notification.model.js";
import User from "../user/user.model.js";
import { ROLES } from "../../config/constants.js";

// Runs every day at 09:00 AM
// Sends reminder notifications to students who haven't submitted
// assignments due within the next 24 hours.
cron.schedule("0 9 * * *", async () => {
  try {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);

    // Find assignments due within the next 24 hours
    const assignments = await Assignment.find({
      deadline: { $lte: nextDay },
    });

    if (!assignments.length) {
      console.log("[Cron] No upcoming assignment deadlines found.");
      return;
    }

    // Fetch students once (outside the loop) — avoids N duplicate DB queries
    // FIX: was "student" (lowercase) — User model enum is "STUDENT"
    const students = await User.find({ role: ROLES.STUDENT }).select("_id");

    for (const assignment of assignments) {
      for (const student of students) {
        const submitted = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: student._id,
        });

        if (!submitted) {
          await Notification.create({
            userId: student._id,
            title: "Assignment Deadline Reminder",
            message: `Submit "${assignment.title}" before the deadline`,
          });
        }
      }
    }

    console.log(`[Cron] Reminders sent for ${assignments.length} assignment(s).`);
  } catch (err) {
    console.error("[Cron] Reminder job failed:", err.message);
  }
});