<template>
  <Pie :data="chartData" :options="chartOptions" />
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
          position: 'bottom'
      }
  }
}
</script>
