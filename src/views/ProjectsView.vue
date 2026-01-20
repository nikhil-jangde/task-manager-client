<template>
  <AppLayout>
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Projects Board</h1>
         <div class="mt-6">
             <div class="flex justify-between text-sm mb-1">
                 <span class="font-medium text-gray-600">Progress</span>
                 <span class="font-bold text-green-600">{{ completionPercentage }}%</span>
             </div>
             <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                 <div class="bg-green-500 h-full rounded-full transition-all duration-500 ease-out" :style="{ width: completionPercentage + '%' }"></div>
             </div>
         </div>
      </div>

      <!-- Kanban -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">
          <!-- Backlog -->
           <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[500px]">
              <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-gray-700 bg-gray-200 px-3 py-1 rounded-full text-sm">Backlog</h3>
                  <button @click="openAddTask" class="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
                      + Add Task
                  </button>
              </div>
              <div class="space-y-3">
                  <div v-for="task in backlogTasks" :key="task.id" @click="selectedTask = task" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                      <div class="flex justify-between items-start">
                          <p class="font-semibold text-gray-800">{{ task.title }}</p>
                           <button @click.stop="deleteTask(task.id)" class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                             <span class="sr-only">Delete</span>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                      <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ task.description }}</p>
                       <div class="mt-4 flex justify-end">
                           <button @click.stop="moveTask(task, 'in_progress')" class="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                               Move to In Progress &rarr;
                           </button>
                       </div>
                  </div>
              </div>
           </div>
           
           <!-- In Progress -->
           <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 min-h-[500px]">
               <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full text-sm">In Progress</h3>
                  <span class="text-xs text-blue-400 font-semibold">{{ inProgressTasks.length }} tasks</span>
              </div>
               <div class="space-y-3">
                  <div v-for="task in inProgressTasks" :key="task.id" @click="selectedTask = task" class="bg-white p-4 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow group cursor-pointer">
                       <div class="flex justify-between items-start">
                          <p class="font-semibold text-gray-800">{{ task.title }}</p>
                            <button @click.stop="deleteTask(task.id)" class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                      <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ task.description }}</p>
                       <div class="mt-4 flex justify-between gap-2">
                            <button @click.stop="moveTask(task, 'backlog')" class="text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                               &larr; Back
                           </button>
                           <button @click.stop="moveTask(task, 'completed')" class="text-xs font-medium bg-green-50 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">
                               Done &rarr;
                           </button>
                       </div>
                  </div>
               </div>
           </div>

           <!-- Completed -->
           <div class="bg-green-50/50 rounded-xl p-4 border border-green-100 min-h-[500px]">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-green-900 bg-green-100 px-3 py-1 rounded-full text-sm">Completed</h3>
                  <span class="text-xs text-green-400 font-semibold">{{ completedTasks.length }} tasks</span>
              </div>
               <div class="space-y-3">
                  <div v-for="task in completedTasks" :key="task.id" @click="selectedTask = task" class="bg-white p-4 rounded-xl shadow-sm border border-green-100 opacity-80 hover:opacity-100 transition-opacity group cursor-pointer">
                       <div class="flex justify-between items-start">
                          <p class="font-semibold text-gray-800 line-through decoration-green-500">{{ task.title }}</p>
                           <button @click="deleteTask(task.id)" class="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                       <div class="mt-4 flex justify-start">
                            <button @click="moveTask(task, 'in_progress')" class="text-xs font-medium bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                               &larr; Re-open
                           </button>
                       </div>
                  </div>
               </div>
           </div>
      </div>

      <!-- Add Task Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
              <h2 class="text-xl font-bold mb-4 text-gray-800">Create New Task</h2>
              <form @submit.prevent="submitTask">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input v-model="newTask.title" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Design Homepage" required />
                  </div>
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="newTask.description" rows="3" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Task details..."></textarea>
                  </div>
                  <div class="flex justify-end gap-3">
                       <button type="button" @click="showAddModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                       <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Create Task</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- View Details Modal -->
      <TaskDetailsModal v-if="selectedTask" :task="selectedTask" @close="selectedTask = null" />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import TaskDetailsModal from '../components/modals/TaskDetailsModal.vue'
import { useTaskStore } from '../stores/tasks'

const taskStore = useTaskStore()

const showAddModal = ref(false)
const selectedTask = ref(null)
const newTask = ref({ title: '', description: '' })

// Load tasks
onMounted(async () => {
    await taskStore.fetchTasks()
    if (taskStore.tasks.length === 0) {
        // Dummy data if empty
        taskStore.tasks = [
            { id: 1, title: 'Setup GitHub Repo', description: 'Initialize repository and add collaborators', status: 'completed' },
            { id: 2, title: 'Design Database Schema', description: 'Draft user and task tables', status: 'completed' },
            { id: 3, title: 'Install Laravel', description: 'Setup API backend', status: 'in_progress' },
            { id: 4, title: 'Frontend Components', description: 'Build Vue components', status: 'backlog' },
        ]
    }
})

const backlogTasks = computed(() => taskStore.tasks.filter(t => t.status === 'backlog'))
const inProgressTasks = computed(() => taskStore.tasks.filter(t => t.status === 'in_progress'))
const completedTasks = computed(() => taskStore.tasks.filter(t => t.status === 'completed'))

const completionPercentage = computed(() => {
    const total = taskStore.tasks.length
    if (total === 0) return 0
    const completed = completedTasks.value.length
    return Math.round((completed / total) * 100)
})

const openAddTask = () => {
    newTask.value = { title: '', description: '' }
    showAddModal.value = true
}

const submitTask = async () => {
    await taskStore.addTask({ ...newTask.value, status: 'backlog' })
    showAddModal.value = false
}

const moveTask = async (task, status) => {
    await taskStore.updateTaskStatus(task.id, status)
    // Update local selected task if open
    if (selectedTask.value && selectedTask.value.id === task.id) {
        selectedTask.value.status = status
    }
}

const deleteTask = async (id) => {
     if(confirm('Are you sure?')) {
         await taskStore.deleteTask(id)
     }
}
</script>
