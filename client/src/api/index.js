import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('etwms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('etwms_token')
      localStorage.removeItem('etwms_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// AUTH
export const loginApi = (email, password) =>
  api.post('/auth/login', { email, password })

export const getMeApi = () => api.get('/auth/me')

export default api