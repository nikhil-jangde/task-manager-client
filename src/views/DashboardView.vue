<template>
  <AppLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p class="text-gray-500 mt-1">Project : Cloud computing web service</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Tasks Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-72">
         <h3 class="text-gray-500 font-semibold mb-4 border-b border-gray-100 pb-2">Total Tasks</h3>
         <div class="flex-1 flex items-center justify-center">
             <div class="text-7xl font-bold text-gray-800">{{ stats?.total || 0 }}</div>
         </div>
      </div>

       <!-- Distribution Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-72">
         <h3 class="text-gray-500 font-semibold mb-4 border-b border-gray-100 pb-2">Tasks Distribution</h3>
         <div class="flex-1 relative">
             <StatusPieChart v-if="stats" :stats="stats.distribution" />
         </div>
      </div>

      <!-- Progress Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-72">
         <h3 class="text-gray-500 font-semibold mb-4 border-b border-gray-100 pb-2">Task Progress</h3>
         <div class="flex-1 flex items-center justify-center">
            <ProgressDoughnut v-if="stats" :percentage="stats.percentage" />
         </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import StatusPieChart from '../components/charts/StatusPieChart.vue'
import ProgressDoughnut from '../components/charts/ProgressDoughnut.vue'
import { useTaskStore } from '../stores/tasks'

const taskStore = useTaskStore()
const stats = computed(() => taskStore.stats || {
    // Fallback dummy data for visual verification if backend isn't ready
    total: 12,
    distribution: { backlog: 3, in_progress: 4, completed: 5 },
    percentage: 65
})

onMounted(async () => {
    await taskStore.fetchStats()
})
</script>
