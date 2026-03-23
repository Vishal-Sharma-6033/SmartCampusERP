import api from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

export const getMyProfile = async () => {
  const response = await api.get(ENDPOINTS.USERS.ME)
  return response.data
}

export const getUsers = async () => {
  const response = await api.get(ENDPOINTS.USERS.ROOT)
  return response.data
}

export const createUser = async (payload) => {
  const response = await api.post(ENDPOINTS.USERS.CREATE, payload)
  return response.data
}

export const updateUser = async (id, payload) => {
  const response = await api.put(`${ENDPOINTS.USERS.ROOT}/${id}`, payload)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`${ENDPOINTS.USERS.ROOT}/${id}`)
  return response.data
}

export const linkParentToStudent = async (payload) => {
  const response = await api.post(ENDPOINTS.USERS.LINK_PARENT, payload)
  return response.data
}
