import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.ondafinance.mock',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('onda-auth')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch {
      // ignore parse errors
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('onda-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
