import Attendance from "./attendance.model.js";

//  Mark Attendance
// export const markAttendance = async (data) => {
//   return await Attendance.create(data);
// };
export const markAttendance = async (data) => {
  const { student, subject, date, status } = data;

  return await Attendance.findOneAndUpdate(
    { student, subject, date },
    { status },
    { new: true, upsert: true }
  );
};

//  Get Student Attendance
export const getStudentAttendance = async (studentId) => {
  return await Attendance.find({ student: studentId })
    .populate("subject", "name")
    .sort({ date: -1 });
};

//  Get Attendance By Date
export const getAttendanceByDate = async (date) => {
  return await Attendance.find({ date });
};

export const deleteAttendance = async (student, subject, date) => {
  return await Attendance.findOneAndDelete({ student, subject, date });
};

export const bulkMarkAttendance = async ({ subject, date, records }) => {
  const operations = records.map((rec) => ({
    updateOne: {
      filter: {
        student: rec.student,
        subject,
        date,
      },
      update: {
        $set: {
          status: rec.status,
        },
      },
      upsert: true,
    },
  }));

  const result = await Attendance.bulkWrite(operations);

  return {
    totalRecords: records.length,
    inserted: result.upsertedCount,
    modified: result.modifiedCount,
  };
};

export const markAllAbsent = async ({ subject, date, students }) => {
  const operations = students.map((studentId) => ({
    updateOne: {
      filter: {
        student: studentId,
        subject,
        date,
      },
      update: {
        $set: {
          status: "absent",
        },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(operations);

  return { message: operations.length + " students marked absent" };
};