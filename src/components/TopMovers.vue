<template>
  <div class="top-movers">
    <div class="movers-section">
      <h3 class="section-title">🚀 Top Gainers (24h)</h3>
      <div class="movers-list">
        <div
          v-for="coin in topGainers"
          :key="`${coin.pair.primary}-${coin.pair.secondary}`"
          class="mover-item gainer"
          @click="$emit('coinClick', coin)"
        >
          <div class="mover-info">
            <div class="mover-name-container">
              <img
                v-if="getCurrencyIcon(coin.pair.primary)"
                :src="getCurrencyIcon(coin.pair.primary)"
                :alt="coin.pair.primary"
                class="mover-icon"
              />
              <span class="mover-name">{{ coin.pair.primary }}</span>
            </div>
            |
            <div class="mover-name-container">
              <img
                v-if="getCurrencyIcon(coin.pair.secondary)"
                :src="getCurrencyIcon(coin.pair.secondary)"
                :alt="coin.pair.primary"
                class="mover-icon"
              />
              <span class="mover-symbol">{{ coin.pair.secondary }}</span>
            </div>
          </div>
          <!-- Мини-график -->
          <div class="mover-chart">
            <svg class="chart-svg" height="20">
              <path
                :d="generateChartPath(coin.priceHistory)"
                stroke="#10b981"
                stroke-width="1.5"
                fill="none"
                class="chart-line"
              />
            </svg>
          </div>
          <div class="mover-change">+{{ coin.price.change.percent }}%</div>
        </div>
      </div>
    </div>

    <div class="movers-section">
      <h3 class="section-title">📉 Top Losers (24h)</h3>
      <div class="movers-list">
        <div
          v-for="coin in topLosers"
          :key="`${coin.pair.primary}-${coin.pair.secondary}`"
          class="mover-item loser"
          @click="$emit('coinClick', coin)"
        >
          <div class="mover-info">
            <div class="mover-name-container">
              <img
                v-if="getCurrencyIcon(coin.pair.primary)"
                :src="getCurrencyIcon(coin.pair.primary)"
                :alt="coin.pair.primary"
                class="mover-icon"
              />
              <span class="mover-name">{{ coin.pair.primary }}</span>
            </div>
            |
            <div class="mover-name-container">
              <img
                v-if="getCurrencyIcon(coin.pair.secondary)"
                :src="getCurrencyIcon(coin.pair.secondary)"
                :alt="coin.pair.primary"
                class="mover-icon"
              />
              <span class="mover-symbol">{{ coin.pair.secondary }}</span>
            </div>
          </div>
          <!-- Мини-график -->
          <div class="mover-chart">
            <svg class="chart-svg" height="20">
              <path
                :d="generateChartPath(coin.priceHistory)"
                stroke="#ef4444"
                stroke-width="1.5"
                fill="none"
                class="chart-line"
              />
            </svg>
          </div>
          <div class="mover-change">{{ coin.price.change.percent }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/stores/market'
import { useCurrencyStore } from '@/stores/currency'

const marketStore = useMarketStore()
const currencyStore = useCurrencyStore()
const { topGainers, topLosers } = storeToRefs(marketStore)
const { currencies } = storeToRefs(currencyStore)

defineEmits(['coinClick'])

// Функция для конвертации SVG в data URI
const toDataUriSvg = (svg: string): string => {
  if (!svg) return ''

  // Check if the SVG is already a data URI
  if (svg.startsWith('data:image/svg+xml;')) {
    return svg
  }

  // Check if it's a base64 string without the data URI prefix
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
  if (base64Regex.test(svg) && svg.length > 20) {
    try {
      // Try to decode to see if it's valid base64
      atob(svg)
      return `data:image/svg+xml;base64,${svg}`
    } catch {
      // Not valid base64, treat as plain SVG
    }
  }

  // Check if it starts with <svg (plain SVG)
  if (svg.trim().startsWith('<svg')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  // Otherwise, treat as plain SVG and encode to data URI
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Функция для получения иконки валюты
const getCurrencyIcon = (currencyCode: string): string => {
  const currency = currencies.value.find((c) => c.code === currencyCode)
  if (currency && currency.icon) {
    return toDataUriSvg(currency.icon)
  }
  return ''
}

// Функция для генерации SVG пути графика
const generateChartPath = (priceHistory: string[]): string => {
  if (priceHistory.length < 2) return ''

  // Конвертируем строки в числа
  const prices = priceHistory.map((p) => parseFloat(p))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice

  // Настройки графика
  const width = 400
  const height = 20
  const padding = 2
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  // Генерируем путь
  let path = ''
  prices.forEach((price, index) => {
    const x = padding + (index / (prices.length - 1)) * chartWidth
    const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight

    if (index === 0) {
      path += `M ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  })

  return path
}
</script>

<style scoped>
.top-movers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #ccc;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.movers-list {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d2d44;
}

.mover-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #3d3d5a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mover-item:hover {
  background-color: #2d2d44;
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 8px;
  transform: translateX(4px);
  border-left: 3px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.mover-item:last-child {
  border-bottom: none;
}

.mover-info {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.mover-name-container {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 55px;
}

.mover-icon {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.mover-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.mover-symbol {
  font-size: 12px;
  color: #d1d5db;
}

.mover-chart {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.chart-svg {
  display: block;
  width: 100%;
}

.chart-svg path {
  width: 100%;
}

.chart-line {
  transition: all 0.3s ease;
}

.mover-item:hover .chart-line {
  stroke-width: 2;
  filter: drop-shadow(0 0 2px currentColor);
}

.mover-change {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.mover-item.gainer .mover-change {
  color: #059669;
  background: #d1fae5;
}

.mover-item.loser .mover-change {
  color: #dc2626;
  background: #fee2e2;
}

@media (max-width: 768px) {
  .top-movers {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .movers-list {
    padding: 12px;
  }

  .mover-item {
    padding: 10px 0;
  }
}
</style>
