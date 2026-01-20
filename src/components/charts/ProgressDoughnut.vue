<template>
  <div class="relative h-40 w-full flex items-center justify-center">
    <Doughnut :data="chartData" :options="chartOptions" />
    <div class="absolute inset-0 flex items-center justify-center flex-col">
        <span class="text-3xl font-bold text-gray-800">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  percentage: {
    type: Number,
    default: 0
  }
})

const chartData = computed(() => {
  return {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        backgroundColor: ['#10B981', '#E5E7EB'],
        data: [props.percentage, 100 - props.percentage],
        cutout: '80%',
        circumference: 180,
        rotation: 270,
        borderRadius: 5
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
      legend: {
          display: false
      },
      tooltip: {
          enabled: false
      }
  }
}
</script>
