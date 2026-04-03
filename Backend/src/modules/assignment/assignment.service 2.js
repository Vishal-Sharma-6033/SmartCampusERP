import ApiError from '../../utils/ApiError.js';
import asyncHandlers from '../../utils/asyncHandler.js';
import Assignment from './assignment.model.js';
import Submission from './submission.model.js'
import Notification from '../notifications/notification.model.js';
export const createAssignment = async(data,user)=>{
    return await Assignment.create({
        ...data,
        teracherId:user.id
    })
}

export const submitAssignment = async (assignmentId, data, user) => {
  const assignment = await Assignment.findById(assignmentId);

  const now = new Date();
  const isLate = now > assignment.deadline;

  let penalty = 0;

  if (isLate) {
    const hoursLate = (now - assignment.deadline) / (1000 * 60 * 60);
    penalty = Math.min(assignment.totalMarks * 0.1, hoursLate); // simple logic
  }

  return await Submission.create({
    assignmentId,
    studentId: user._id,
    text: data.text,
    status: isLate ? "late" : "submitted",
    latePenalty: penalty,
  });
};


export const getStudentAssignments = async (studentId) => {
  return await Submission.find({ studentId })
    .populate("assignmentId");
};

export const gradeSubmission = async(submissionId, data)=>{
    const submission = await Submission.findById(submissionId)
    .populate("assignmentId")
    if(!submission){
        throw new ApiError("Submission not found")

    }
    if(data.marks > submission.assignmentId.totalMarks){
        throw new ApiError(400,"Marks cannot exceed total marks")
    }
    submission.marks = data.marks
    submission.feedback = data.feedback
    
    await submission.save()

      await Notification.create({
    userId: submission.studentId,   // student ko notification jayega
    title: "Assignment Graded",
    message: `Your assignment "${submission.assignmentId.title}" has been graded`,
    type: "grade",
  });

    return submission
}

export const getAssignmentsBySubject =  async (subjectId) => {
  return await Assignment.find({ subjectId }).sort({ createdAt: -1 });
};