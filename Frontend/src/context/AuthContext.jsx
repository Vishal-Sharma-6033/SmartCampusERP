import { createContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/auth.service.js'
import * as userService from '../services/user.service.js'
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAuthStorage,
} from '../utils/storage.js'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken())
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(Boolean(getAccessToken()))

  const logout = () => {
    clearAuthStorage()
    setToken(null)
    setUser(null)
    setLoading(false)
  }

  const login = async ({ email, password }) => {
    const response = await authService.login({ email, password })
    const payload = response?.data || {}

    const accessToken = payload?.accessToken
    const refreshToken = payload?.refreshToken
    const loggedInUser = payload?.user

    setAuthStorage({
      accessToken,
      refreshToken,
      user: loggedInUser,
    })

    setToken(accessToken || null)
    setUser(loggedInUser || null)

    return response
  }

  const register = async (payload) => {
    return authService.register(payload)
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
    if (token) {
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
      user,
      loading,
      login,
      register,
      logout,
      hasRole,
    }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
