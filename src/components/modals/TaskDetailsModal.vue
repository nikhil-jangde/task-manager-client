<template>
  <div v-if="task" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" :class="statusClass">
              {{ task.status.replace('_', ' ') }}
            </span>
            <span class="text-xs text-gray-400 font-medium">#{{ task.id }}</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">{{ task.title }}</h2>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <!-- Description Section -->
        <div>
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
            Description
          </h3>
          <p class="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {{ task.description || 'No description provided.' }}
          </p>
        </div>

        <!-- Meta Section -->
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Created By</p>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {{ auth.user?.name?.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-sm font-semibold text-gray-700">{{ auth.user?.name }}</span>
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Created At</p>
                <span class="text-sm font-semibold text-gray-700">{{ formatDate(task.created_at) }}</span>
            </div>
        </div>

        <!-- Comments Section -->
        <div>
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            Comments ({{ comments.length }})
          </h3>

          <!-- Post Comment Form -->
          <form @submit.prevent="submitComment" class="mb-6">
            <div class="relative">
              <textarea v-model="newComment" rows="2" class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none pr-12" placeholder="Write a comment..."></textarea>
              <button type="submit" :disabled="!newComment.trim() || submitting" class="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>

          <!-- Comments List -->
          <div class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex flex-shrink-0 items-center justify-center text-[10px] font-bold text-gray-500">
                {{ comment.user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold text-gray-700">{{ comment.user.name }}</span>
                    <span class="text-[10px] text-gray-400 font-medium">{{ formatTimeAgo(comment.created_at) }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ comment.content }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="comments.length === 0" class="text-center py-8 text-gray-400 italic text-sm">
                No comments yet. Be the first to comment!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const auth = useAuthStore()
const comments = ref([])
const newComment = ref('')
const submitting = ref(false)

const statusClass = computed(() => {
    switch(props.task.status) {
        case 'backlog': return 'bg-gray-100 text-gray-600'
        case 'in_progress': return 'bg-blue-50 text-blue-600'
        case 'completed': return 'bg-green-50 text-green-600'
        default: return 'bg-gray-50 text-gray-500'
    }
})

const fetchComments = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/${props.task.id}/comments`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    comments.value = response.data
  } catch (error) {
    console.error('Failed to fetch comments', error)
  }
}

const submitComment = async () => {
    if (!newComment.value.trim() || submitting.value) return
    submitting.value = true
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tasks/${props.task.id}/comments`, {
            content: newComment.value
        }, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        comments.value.unshift(response.data)
        newComment.value = ''
    } catch (error) {
        console.error('Failed to post comment', error)
        alert('Failed to post comment. Please try again.')
    } finally {
        submitting.value = false
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
}

onMounted(fetchComments)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e2e2e2;
}
</style>
