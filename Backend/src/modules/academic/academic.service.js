import Subject from "./subject.model.js";
import ApiError from "../../utils/ApiError.js";


// CREATE SUBJECT
export const createSubjectService = async (data, tenantId) => {
  console.log("SERVICE TENANT:", tenantId);

  return await Subject.create({ ...data, tenantId });
};

// GET SUB BY SEMESTER SERVICE
export const getSubjectsBySemesterService = async (semester, tenantId) => {
  return await Subject.find({ semester: Number(semester), tenantId })
    .populate("teacher", "name email")
    .populate("students", "name email");
};


// GET SUB BY ID
export const getSubjectByIdService = async (id, tenantId) => {
  const subject = await Subject.findOne({ _id: id, tenantId })
    .populate("teacher")
    .populate("students");

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

// GET STUDENT DASHBOARD
export const getStudentDashboardService = async (studentId, tenantId) => {
  const subjects = await Subject.find({
    students: studentId,
    tenantId,
  }).populate("teacher", "name");

  return {
    totalSubjects: subjects.length,
    subjects,
  };
};

//  UPDATE SUBJECT
export const updateSubjectService = async (id, data, tenantId) => {
  const subject = await Subject.findOneAndUpdate({ _id: id, tenantId }, data, {
    new: true,
  });

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

//  DELETE SUBJECT
export const deleteSubjectService = async (id, tenantId) => {
  const subject = await Subject.findOneAndDelete({
    _id: id,
    tenantId,
  });

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

//  ADD STUDENT
export const addStudentToSubjectService = async (
  subjectId,
  studentId,
  tenantId,
) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: subjectId, tenantId },
    { $addToSet: { students: studentId } }, // no duplicate
    { new: true },
  );

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};

//  REMOVE STUDENT
export const removeStudentFromSubjectService = async (
  subjectId,
  studentId,
  tenantId,
) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: subjectId, tenantId },
    { $pull: { students: studentId } },
    { new: true },
  );

  if (!subject) throw new ApiError(404, "Subject not found");

  return subject;
};
