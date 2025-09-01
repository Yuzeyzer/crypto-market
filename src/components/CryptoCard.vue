<template>
  <div class="crypto-card" @click="$emit('click', coin)">
    <div class="crypto-header">
      <div class="crypto-info">
        <div class="crypto-name-container">
          <img
            v-if="getCurrencyIcon(coin.pair.primary)"
            :src="getCurrencyIcon(coin.pair.primary)"
            :alt="coin.pair.primary"
            class="crypto-icon"
          />
          <h3 class="crypto-name">{{ coin.pair.primary }}</h3>
        </div>
        |
        <div class="crypto-name-container">
          <img
            v-if="getCurrencyIcon(coin.pair.secondary)"
            :src="getCurrencyIcon(coin.pair.secondary)"
            :alt="coin.pair.secondary"
            class="crypto-icon"
          />
          <h3 class="crypto-name">{{ coin.pair.secondary }}</h3>
        </div>
      </div>
      <div class="crypto-pair">{{ coin.pair.primary }}/{{ coin.pair.secondary }}</div>
    </div>

    <div class="crypto-price">
      <span class="price">${{ formatPrice(parseFloat(coin.price.last)) }}</span>
      <span
        class="price-change"
        :class="{
          positive: coin.price.change.direction === 'Up',
          negative: coin.price.change.direction === 'Down',
        }"
      >
        {{ coin.price.change.direction === 'Up' ? '+' : '' }}{{ coin.price.change.percent }}%
      </span>
    </div>

    <div class="crypto-stats">
      <div class="stat">
        <span class="stat-label">Bid</span>
        <span class="stat-value">${{ formatPrice(parseFloat(coin.price.bestBid)) }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Ask</span>
        <span class="stat-value">${{ formatPrice(parseFloat(coin.price.bestOffer)) }}</span>
      </div>
    </div>

    <div class="crypto-volume">
      <div class="volume-stat">
        <span class="volume-label">Volume ({{ coin.pair.primary }})</span>
        <span class="volume-value">{{ formatNumber(parseFloat(coin.volume.primary)) }}</span>
      </div>
    </div>

    <!-- Мини-график изменения цены -->
    <div class="mini-chart">
      <svg class="chart-svg" width="100%" height="40" viewBox="0 0 200 40">
        <path
          :d="generateChartPath(coin.priceHistory)"
          :stroke="coin.price.change.direction === 'Up' ? '#10b981' : '#ef4444'"
          stroke-width="2"
          fill="none"
          class="chart-line"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketData } from '@/services/api'
import { useCurrencyStore } from '@/stores/currency'
import { storeToRefs } from 'pinia'

defineProps<{
  coin: MarketData
}>()

const currencyStore = useCurrencyStore()
const { currencies } = storeToRefs(currencyStore)

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

defineEmits<{
  click: [coin: MarketData]
}>()

const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return price.toFixed(6)
  } else if (price < 1) {
    return price.toFixed(4)
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T'
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  }
  return num.toFixed(2)
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
  const width = 200
  const height = 40
  const padding = 5
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
.crypto-card {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #3d3d5a;
}

.crypto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
  background: #1f1f3e;
}

.crypto-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.crypto-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.crypto-info {
  display: flex;
  gap: 16px;
  flex: 1;
}

.crypto-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  width: 65px;
}

.crypto-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.crypto-name {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.crypto-symbol {
  font-size: 14px;
  color: #d1d5db;
  font-weight: 500;
}

.crypto-pair {
  background: #2d2d44;
  color: #d1d5db;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.crypto-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.price-change {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.price-change.positive {
  color: #059669;
  background: #d1fae5;
}

.price-change.negative {
  color: #dc2626;
  background: #fee2e2;
}

.crypto-stats {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.stat {
  flex: 1;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #d1d5db;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.crypto-volume {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #2d2d44;
}

.volume-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.volume-label {
  font-size: 12px;
  color: #d1d5db;
}

.volume-value {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.mini-chart {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #3d3d5a;
}

.chart-svg {
  width: 100%;
  height: 40px;
  display: block;
}

.chart-line {
  transition: all 0.3s ease;
}

.crypto-card:hover .chart-line {
  stroke-width: 3;
  filter: drop-shadow(0 0 4px currentColor);
}
</style>
