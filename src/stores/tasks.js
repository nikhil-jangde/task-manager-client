import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    stats: null,
    loading: false
  }),
  actions: {
    async fetchTasks() {
      this.loading = true
      const auth = useAuthStore()
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        this.tasks = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchStats() {
      const auth = useAuthStore()
      try {
        const response = await axios.get(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        this.stats = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async addTask(task) {
      const auth = useAuthStore()
      const response = await axios.post(`${API_URL}/tasks`, task, {
          headers: { Authorization: `Bearer ${auth.token}` }
      })
      this.tasks.push(response.data)
    },
    async updateTaskStatus(id, status) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
          task.status = status
          const auth = useAuthStore()
          await axios.put(`${API_URL}/tasks/${id}`, { ...task, status }, { // Using PUT or PATCH
              headers: { Authorization: `Bearer ${auth.token}` }
          })
      }
    },
    async deleteTask(id) {
       const auth = useAuthStore()
       await axios.delete(`${API_URL}/tasks/${id}`, {
           headers: { Authorization: `Bearer ${auth.token}` }
       })
       this.tasks = this.tasks.filter(t => t.id !== id)
    }
  }
})
