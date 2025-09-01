<template>
  <div class="trading-chart">
    <div class="chart-header">
      <h3>Price Chart</h3>
      <div class="chart-controls">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          :class="['period-btn', { active: selectedPeriod === period.value }]"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas" class="chart-canvas"></canvas>
    </div>

    <div class="chart-info">
      <div class="price-info">
        <span class="current-price">${{ formatPrice(currentPrice) }}</span>
        <span
          class="price-change"
          :class="{ positive: priceChange >= 0, negative: priceChange < 0 }"
        >
          {{ priceChange >= 0 ? '+' : '' }}{{ formatPrice(priceChange) }} ({{
            priceChangePercent
          }}%)
        </span>
      </div>
      <div class="volume-info">
        <span class="volume-label">Volume:</span>
        <span class="volume-value">{{ formatVolume(volume) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'

interface Props {
  priceHistory: string[]
  currentPrice: number
  priceChange: number
  priceChangePercent: number
  volume: number
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement>()
const chart = ref<Chart | null>(null)
const selectedPeriod = ref('1D')

const timePeriods = [
  { label: '1H', value: '1H' },
  { label: '4H', value: '4H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
]

const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return price.toFixed(6)
  } else if (price < 1) {
    return price.toFixed(4)
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
}

const formatVolume = (volume: number): string => {
  if (volume >= 1e12) {
    return (volume / 1e12).toFixed(2) + 'T'
  } else if (volume >= 1e9) {
    return (volume / 1e9).toFixed(2) + 'B'
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(2) + 'M'
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(2) + 'K'
  }
  return volume.toFixed(2)
}

const createChart = async () => {
  if (!chartCanvas.value || !props.priceHistory || props.priceHistory.length === 0) return

  await nextTick()

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chart.value) {
    chart.value.destroy()
  }

  try {
    // Создаем график с данными сразу
    const prices = props.priceHistory.map((p) => parseFloat(p))
    const labels = Array.from({ length: prices.length }, (_, i) => i + 1)

    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Price',
            data: prices,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: true },
          y: { display: true },
        },
      },
    })
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy()
  }
})
</script>

<style scoped>
.trading-chart {
  background: #1a1a2e;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #2d2d44;
  margin-bottom: 32px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h3 {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.period-btn {
  background: #2d2d44;
  border: 1px solid #3d3d5a;
  color: #d1d5db;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.period-btn:hover {
  border-color: #4d4d6a;
  background: #3d3d5a;
}

.period-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.chart-container {
  position: relative;
  height: 400px;
  margin-bottom: 24px;
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #3d3d5a;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.price-change {
  font-size: 16px;
  font-weight: 600;
}

.price-change.positive {
  color: #10b981;
}

.price-change.negative {
  color: #ef4444;
}

.volume-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-label {
  color: #9ca3af;
  font-size: 14px;
}

.volume-value {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .trading-chart {
    padding: 16px;
  }

  .chart-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .chart-container {
    height: 300px;
  }

  .chart-info {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
