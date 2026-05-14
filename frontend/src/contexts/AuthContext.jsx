import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSession, logout as apiLogout, login as apiLogin } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  const hasPermission = (perm) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return (user.effectivePermissions || []).includes(perm)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
