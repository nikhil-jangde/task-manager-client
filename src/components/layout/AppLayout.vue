<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
      <div class="p-8 flex items-center gap-3">
        <div class="bg-blue-600 p-1.5 rounded text-white shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <span class="text-2xl font-bold text-gray-800 tracking-tight">TaskMgr</span>
      </div>
      
      <div class="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</div>

      <nav class="flex-1 px-4 space-y-2">
        <RouterLink to="/" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200" :class="$route.path === '/' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-gray-100'">
           <HomeIcon class="w-5 h-5" />
           <span class="font-medium">Dashboard</span>
        </RouterLink>
        <RouterLink to="/projects" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200" :class="$route.path.startsWith('/projects') ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-gray-100'">
           <FolderIcon class="w-5 h-5" />
           <span class="font-medium">Projects</span>
        </RouterLink>
        <RouterLink to="/members" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200" :class="$route.path.startsWith('/members') ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-gray-100'">
           <UsersIcon class="w-5 h-5" />
           <span class="font-medium">Members</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-gray-100">
         <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
           <ArrowRightStartOnRectangleIcon class="w-5 h-5" />
           <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { HomeIcon, FolderIcon, UsersIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const logout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
