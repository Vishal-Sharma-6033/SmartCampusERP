import axios from 'axios'
import { getAccessToken, getTenantId } from '../utils/storage.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    const tenantId = getTenantId()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId
    }

    return config
  },
  (error) => Promise.reject(error),
)

export default api
