<template>
  <AppLayout>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Members</h1>
        <p class="text-gray-500 mt-1">Manage your team members and their roles</p>
      </div>
      <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
        <span class="text-xl">+</span> Create Member
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex items-center gap-4">
          <span class="text-gray-500 font-semibold">List of Members</span>
          <div class="flex-1 max-w-xs relative">
              <input type="text" v-model="searchQuery" placeholder="search..." class="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4 text-center">Edit</th>
              <th class="px-6 py-4 text-center">Delete</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">{{ member.id }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ member.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ member.email }}</td>
              <td class="px-6 py-4 text-center">
                <button @click="openEditModal(member)" class="text-blue-600 font-medium px-4 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors text-xs">Edit</button>
              </td>
              <td class="px-6 py-4 text-center">
                <button @click="deleteUser(member.id)" class="text-red-600 font-medium px-4 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-colors text-xs">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ isEditing ? 'Edit Member' : 'Create New Member' }}</h2>
        
        <form @submit.prevent="saveMember" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input v-model="form.name" required type="text" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input v-model="form.email" required type="email" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com">
          </div>
          <div v-if="!isEditing">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input v-model="form.password" required :type="showPassword ? 'text' : 'password'" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12" placeholder="••••••••">
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div v-else>
            <label class="block text-sm font-semibold text-gray-700 mb-1">New Password (leave blank to keep current)</label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12" placeholder="••••••••">
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button type="button" @click="showModal = false" class="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
            <button type="submit" :disabled="loading" class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50">
              {{ loading ? 'Saving...' : (isEditing ? 'Update Member' : 'Create Member') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import AppLayout from '../components/layout/AppLayout.vue'
import { useAuthStore } from '../stores/auth'

const members = ref([])
const searchQuery = ref('')
const auth = useAuthStore()

const showModal = ref(false)
const showPassword = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  email: '',
  password: ''
})

const fetchMembers = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        members.value = response.data
    } catch (error) {
        console.error('Error fetching members:', error)
    }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = { name: '', email: '', password: '' }
  showModal.value = true
}

const openEditModal = (member) => {
  isEditing.value = true
  editingId.value = member.id
  form.value = { name: member.name, email: member.email, password: '' }
  showModal.value = true
}

const saveMember = async () => {
  loading.value = true
  try {
    const url = isEditing.value 
      ? `${import.meta.env.VITE_API_BASE_URL}/users/${editingId.value}`
      : `${import.meta.env.VITE_API_BASE_URL}/users`
    
    const method = isEditing.value ? 'put' : 'post'
    
    // Remove empty password on edit
    const payload = { ...form.value }
    if (isEditing.value && !payload.password) {
      delete payload.password
    }

    await axios({
      method,
      url,
      data: payload,
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    await fetchMembers()
    showModal.value = false
  } catch (error) {
    alert(error.response?.data?.message || 'Something went wrong')
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            })
            members.value = members.value.filter(m => m.id !== id)
        } catch (error) {
            console.error('Error deleting member:', error)
        }
    }
}

const filteredMembers = computed(() => {
    return members.value.filter(m => 
        m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        m.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

onMounted(fetchMembers)
</script>
