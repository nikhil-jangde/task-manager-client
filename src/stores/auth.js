import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async fetchUser() {
      if (!this.token) return
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Failed to fetch user', error)
      }
    },
    async register(userData) {
      try {
        const response = await axios.post(`${API_URL}/register`, userData)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        throw error
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post(`${API_URL}/login`, credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        throw error
      }
    },
    async logout() {
      try {
          if (this.token) {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
          }
      } catch (e) {
          console.error(e)
      } finally {
          this.token = null
          this.user = null
          localStorage.removeItem('token')
          localStorage.removeItem('user')
      }
    }
  }
})
