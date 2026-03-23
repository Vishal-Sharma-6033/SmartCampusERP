const STORAGE_KEYS = {
  ACCESS_TOKEN: 'erp_access_token',
  REFRESH_TOKEN: 'erp_refresh_token',
  TENANT_ID: 'erp_tenant_id',
  USER: 'erp_user',
}

export const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
export const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
export const getTenantId = () => localStorage.getItem(STORAGE_KEYS.TENANT_ID)

export const getStoredUser = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.USER)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setAuthStorage = ({ accessToken, refreshToken, tenantId, user }) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  if (tenantId) localStorage.setItem(STORAGE_KEYS.TENANT_ID, tenantId)
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const setTenantStorage = (tenantId) => {
  if (tenantId) {
    localStorage.setItem(STORAGE_KEYS.TENANT_ID, tenantId)
  } else {
    localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
  }
}

export const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
  localStorage.removeItem(STORAGE_KEYS.USER)
}
