import api from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

export const login = async (payload) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, payload)
  return response.data
}

export const register = async (payload) => {
  const response = await api.post(ENDPOINTS.AUTH.REGISTER, payload)
  return response.data
}
