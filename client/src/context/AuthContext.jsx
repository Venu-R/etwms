import { createContext, useContext, useState } from 'react'
import { loginApi } from '../api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('etwms_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem('etwms_token')
  )

  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await loginApi(email, password)

      const { token, user } = res.data.data

      localStorage.setItem('etwms_token', token)
      localStorage.setItem('etwms_user', JSON.stringify(user))

      setToken(token)
      setUser(user)

      return { success: true, role: user.role }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)