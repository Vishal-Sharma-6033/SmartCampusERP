import { createContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/auth.service.js'
import * as userService from '../services/user.service.js'
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  getTenantId,
  setAuthStorage,
  setTenantStorage,
} from '../utils/storage.js'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken())
  const [tenantId, setTenantIdState] = useState(getTenantId())
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(Boolean(getAccessToken()))

  const logout = () => {
    clearAuthStorage()
    setToken(null)
    setTenantIdState(null)
    setUser(null)
    setLoading(false)
  }

  const login = async ({ email, password, tenantId: incomingTenantId }) => {
    const response = await authService.login({ email, password })
    const payload = response?.data || {}

    const accessToken = payload?.accessToken
    const refreshToken = payload?.refreshToken
    const loggedInUser = payload?.user

    setAuthStorage({
      accessToken,
      refreshToken,
      tenantId: incomingTenantId,
      user: loggedInUser,
    })

    setToken(accessToken || null)
    setTenantIdState(incomingTenantId || null)
    setUser(loggedInUser || null)

    return response
  }

  const register = async (payload) => {
    return authService.register(payload)
  }

  const updateTenant = (nextTenantId) => {
    setTenantStorage(nextTenantId)
    setTenantIdState(nextTenantId || null)
  }

  const fetchMe = async () => {
    try {
      const response = await userService.getMyProfile()
      const nextUser = response?.data || null
      setUser(nextUser)
      setAuthStorage({ user: nextUser })
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && tenantId) {
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [])

  const hasRole = (roles) => {
    if (!user?.role) return false
    if (!roles?.length) return true
    return roles.includes(user.role)
  }

  const value = useMemo(
    () => ({
      token,
      tenantId,
      user,
      loading,
      login,
      register,
      logout,
      hasRole,
      setTenantId: updateTenant,
    }),
    [token, tenantId, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
