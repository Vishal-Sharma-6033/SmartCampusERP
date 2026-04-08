import Exam from "./exam.model.js";
import Result from "./result.model.js";
import Seating from "./seating.model.js";
import User from "../user/user.model.js";
import ExamRegistration from "./examReg.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";


// 📌 Create Exam (Admin,teacher)
export const createExam = async (data) => {
  const { title, type, subject, date, totalMarks, passingMarks,className,semester,endTime,duration,startTime, } = data;

  // basic validation
  if (!title || !type || !subject || !date || !totalMarks || !passingMarks) {
    throw new ApiError(400, "All fields are required");
  }

  if (passingMarks > totalMarks) {
    throw new ApiError(400, "Passing marks cannot be greater than total marks");
  }

 const exam = await Exam.create({
    title,
    type,
    subject,

    className: className || "BCA",
    semester: semester || 1,

    date,

    startTime: startTime || "10:00",
    endTime: endTime || "13:00",

    duration: duration || 180,

    totalMarks,
    passingMarks,
  });


  return exam;
};


export const getAllExams = async (query) => {
  const filter = {};

  if (query.semester) filter.semester = query.semester;
  if (query.type) filter.type = query.type;

  return await Exam.find(filter).sort({ date: -1 });
};
export const registerExam = async (examId, studentId) => {
  const exam = await Exam.findById(examId);
  if (!exam) throw new ApiError(404, "Exam not found");

  // 🔥 count existing students
  const count = await ExamRegistration.countDocuments({ exam: examId });

  const roomNumber = Math.floor(count / 30) + 1; // 30 seats per room
  const seatNumber = (count % 30) + 1;

  const registration = await ExamRegistration.create({
    student: studentId,
    exam: examId,
    roomNumber,
    seatNumber,
  });

  return registration;
};

// export const publishResult = async (data)=>{
//     const {student, exam , markObtained} = data
//     const examData = await Exam.findById(exam)

//     if(!examData) throw new ApiError(404, "Exam not found")
    
//     const status = markObtained >= examData.passingMarks ? "pass" : "fail"

//     const result = await Result.create({
//         student,
//         exam,
//         markObtained,
//         status
//     })
//     return result;
// }
export const publishResult = async (data) => {
  const { student, exam, subjects } = data;

  const total = subjects.reduce((acc, s) => acc + s.marks, 0);
  const percentage = total / subjects.length;

  let grade = "C";
  if (percentage >= 75) grade = "A";
  else if (percentage >= 60) grade = "B";

  const examData = await Exam.findById(exam);

  const status =
    percentage >= examData.passingMarks ? "pass" : "fail";

  return await Result.create({
    student,
    exam,
    subjects,
    total,
    percentage,
    grade,
    status,
  });
};

export const getResults = async (studentId) => {
    console.log("TOKEN USER:", studentId);

     const results = await Result.find({ student: studentId })
    .populate("exam")
    .populate("student", "name email");
    console.log("RESULTS FOUND:", results);


   return results;
};



export const getHallTicket = async (studentId) => {
  const student = await User.findById(studentId);

  const seating = await Seating.find({ student: studentId })
    .populate("exam");

  if (!seating.length) {
    throw new ApiError(404, "Hall ticket not generated yet");
  }

  return {
    student,
    exams: seating.map((s) => ({
      exam: s.exam.title,
      subject: s.exam.subject,
      date: s.exam.date,
      roomNumber: s.roomNumber,
      seatNumber: s.seatNumber,
      block: s.block,
    })),
  };
};

export const generateSeating = async (examId, options = {}) => {
  const {
    rooms = 30,
    seatsPerRoom = 20,
    startBlock = "A",
  } = options;

  // ✅ Check exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  // ✅ Get all students
  const students = await User.find({ role: "STUDENT" }).select("_id");
// const students = await User.find();

// console.log("ALL USERS:", students);
  if (!students.length) {
    throw new ApiError(400, "No students found");
  }

  // 🔥 Capacity check
  const totalCapacity = rooms * seatsPerRoom;
  if (students.length > totalCapacity * 5) {
    throw new ApiError(400, "Too many students for seating allocation");
  }

  let room = 1;
  let seat = 1;
  let block = startBlock;

  const allocations = [];

  for (let i = 0; i < students.length; i++) {
    allocations.push({
      student: students[i]._id,
      exam: examId,
      roomNumber: room,
      seatNumber: seat,
      block,
    });

    seat++;

    if (seat > seatsPerRoom) {
      seat = 1;
      room++;
    }

    if (room > rooms) {
      room = 1;
      block = String.fromCharCode(block.charCodeAt(0) + 1); // A → B → C
    }
  }

  // 🔥 Reset old seating
  await Seating.deleteMany({ exam: examId });

  // 🔥 Insert new seating
  await Seating.insertMany(allocations);

  return {
    totalStudents: students.length,
    roomsUsed: rooms,
    seatsPerRoom,
    blocksUsed: block,
  };
};