<template>
  <div class="relative h-48 w-full flex items-center justify-center">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ backlog: 0, in_progress: 0, completed: 0 })
  }
})

const chartData = computed(() => {
  return {
    labels: ['Backlog', 'In Progress', 'Completed'],
    datasets: [
      {
        backgroundColor: ['#E5E7EB', '#3B82F6', '#10B981'], // Gray-200, Blue-500, Green-500
        data: [props.stats.backlog, props.stats.in_progress, props.stats.completed]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
      legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 11
            }
          }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 6
      }
  }
}
</script>
