import api from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

export const getSubjects = async (semester) => {
  const semesterNum = Number(semester)
  const params = Number.isFinite(semesterNum) && semesterNum > 0 ? { semester: semesterNum } : { semester: 1 }
  const response = await api.get(ENDPOINTS.ACADEMIC.SUBJECTS, { params })
  return response.data
}

export const createSubject = async (payload) => {
  const response = await api.post(ENDPOINTS.ACADEMIC.SUBJECTS, payload)
  return response.data
}

export const updateSubject = async (id, payload) => {
  const response = await api.put(ENDPOINTS.ACADEMIC.SUBJECT_BY_ID(id), payload)
  return response.data
}

export const deleteSubject = async (id) => {
  const response = await api.delete(ENDPOINTS.ACADEMIC.SUBJECT_BY_ID(id))
  return response.data
}

export const addStudent = async (id, studentId) => {
  const response = await api.post(ENDPOINTS.ACADEMIC.ADD_STUDENT(id), { studentId })
  return response.data
}

export const removeStudent = async (id, studentId) => {
  const response = await api.post(ENDPOINTS.ACADEMIC.REMOVE_STUDENT(id), { studentId })
  return response.data
}
