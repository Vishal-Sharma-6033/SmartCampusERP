import Subject from "./subject.model.js";
import ApiError from "../../utils/ApiError.js";

// CREATE SUBJECT
export const createSubjectService = async (data) => {
  const { name, code, semester } = data;

  if (!name || !code || !semester) {
    throw new ApiError(400, "Required fields missing");
  }

  const subject = await Subject.create({
    ...data,
    students: data.students || [], 
  });

  return subject;
};
// GET SUBJECTS by semester
export const getSubjectsService = async (semester) => {
  const filter = semester ? { semester: Number(semester) } : {};

  return await Subject.find(filter)
    .populate("teacher", "name email")
    .populate("students", "name email");
};

// GET SUBJECT BY ID
export const getSubjectByIdService = async (id) => {
  const subject = await Subject.findById(id)
    .populate("teacher", "name email")
    .populate("students", "name email");

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

// STUDENT DASHBOARD
export const getStudentDashboardService = async (studentId) => {
  const subjects = await Subject.find({
    students: studentId,
  }).populate("teacher", "name");

  return {
    totalSubjects: subjects.length,
    subjects,
  };
};

// UPDATE SUBJECT
export const updateSubjectService = async (id, data) => {
  const subject = await Subject.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

// DELETE SUBJECT
export const deleteSubjectService = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

// ADD STUDENT
export const addStudentToSubjectService = async (subjectId, studentId) => {
  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    { $addToSet: { students: studentId } },
    { new: true },
  );

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

// REMOVE STUDENT
export const removeStudentFromSubjectService = async (subjectId, studentId) => {
  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    { $pull: { students: studentId } },
    { new: true },
  );

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};
