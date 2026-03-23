import api from './api.js'
import { ENDPOINTS } from '../utils/constants.js'

export const createTenant = async (payload) => {
  const response = await api.post(ENDPOINTS.TENANT.CREATE, payload)
  return response.data
}
