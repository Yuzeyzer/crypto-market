<template>
  <div v-if="coin" class="coin-detail">
    <div class="detail-header">
      <button @click="$emit('close')" class="close-btn">← Back</button>
      <div class="coin-title">
        <div class="coin-title-container">
          <img
            v-if="getCurrencyIcon(coin.pair.primary)"
            :src="getCurrencyIcon(coin.pair.primary)"
            :alt="coin.pair.primary"
            class="coin-icon"
          />
          <h1>{{ coin.pair.primary }}</h1>
        </div>
        <span class="coin-symbol">{{ coin.pair.secondary }}</span>
        <span class="coin-pair">{{ coin.pair.primary }}/{{ coin.pair.secondary }}</span>
      </div>
    </div>

    <div class="detail-content">
      <!-- Trading Chart -->
      <TradingChart
        :price-history="coin.priceHistory"
        :current-price="parseFloat(coin.price.last)"
        :price-change="parseFloat(coin.price.change.amount)"
        :price-change-percent="parseFloat(coin.price.change.percent)"
        :volume="parseFloat(coin.volume.primary)"
      />

      <div class="price-section">
        <div class="current-price">
          <span class="price">${{ formatPrice(parseFloat(coin.price.last)) }}</span>
          <span
            class="price-change"
            :class="{
              'positive': coin.price.change.direction === 'Up',
              'negative': coin.price.change.direction === 'Down'
            }"
          >
            {{ coin.price.change.direction === 'Up' ? '+' : '' }}{{ coin.price.change.percent }}%
          </span>
        </div>
        <p class="last-updated">Change: ${{ coin.price.change.amount }} ({{ coin.price.change.direction }})</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Best Bid</h3>
          <p class="stat-value">${{ formatPrice(parseFloat(coin.price.bestBid)) }}</p>
        </div>

        <div class="stat-card">
          <h3>Best Ask</h3>
          <p class="stat-value">${{ formatPrice(parseFloat(coin.price.bestOffer)) }}</p>
        </div>

        <div class="stat-card">
          <h3>Volume ({{ coin.pair.primary }})</h3>
          <p class="stat-value">{{ formatNumber(parseFloat(coin.volume.primary)) }}</p>
        </div>

        <div class="stat-card">
          <h3>Volume ({{ coin.pair.secondary }})</h3>
          <p class="stat-value">${{ formatNumber(parseFloat(coin.volume.secondary)) }}</p>
        </div>

        <div class="stat-card">
          <h3>Price Change</h3>
          <p class="stat-value">${{ coin.price.change.amount }}</p>
          <p class="stat-change" :class="{ 'positive': coin.price.change.direction === 'Up', 'negative': coin.price.change.direction === 'Down' }">
            {{ coin.price.change.direction === 'Up' ? '+' : '' }}{{ coin.price.change.percent }}%
          </p>
        </div>

        <div class="stat-card">
          <h3>Price History Points</h3>
          <p class="stat-value">{{ coin.priceHistory.length }}</p>
        </div>
      </div>

      <div class="performance-section">
        <h2>Price History (Last 10 Points)</h2>
        <div class="price-history">
          <div
            v-for="(price, index) in coin.priceHistory.slice(-10)"
            :key="index"
            class="history-item"
          >
            <span class="history-index">{{ index + 1 }}</span>
            <span class="history-price">${{ formatPrice(parseFloat(price)) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketData } from '@/services/api';
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';
import TradingChart from './TradingChart.vue';

defineProps<{
  coin: MarketData | null;
}>();

defineEmits<{
  close: [];
}>();

const currencyStore = useCurrencyStore();
const { currencies } = storeToRefs(currencyStore);

// Функция для конвертации SVG в data URI
const toDataUriSvg = (svg: string): string => {
  if (!svg) return '';

  // Check if the SVG is already a data URI
  if (svg.startsWith('data:image/svg+xml;')) {
    return svg;
  }

  // Check if it's a base64 string without the data URI prefix
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (base64Regex.test(svg) && svg.length > 20) {
    try {
      // Try to decode to see if it's valid base64
      atob(svg);
      return `data:image/svg+xml;base64,${svg}`;
    } catch {
      // Not valid base64, treat as plain SVG
    }
  }

  // Check if it starts with <svg (plain SVG)
  if (svg.trim().startsWith('<svg')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Otherwise, treat as plain SVG and encode to data URI
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Функция для получения иконки валюты
const getCurrencyIcon = (currencyCode: string): string => {
  const currency = currencies.value.find(c => c.code === currencyCode);
  if (currency && currency.icon) {
    return toDataUriSvg(currency.icon);
  }
  return '';
};

const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};
</script>

<style scoped>
.price-history {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.history-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #1a1a2e;
  border-radius: 8px;
  border: 1px solid #3d3d5a;
  transition: all 0.3s ease;
}

.history-item:hover {
  border-color: #3b82f6;
  background: #2d2d44;
  transform: scale(1.05);
}

.history-index {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.history-price {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.coin-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #1a1a2e;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d2d44;
}

.detail-header {
  margin-bottom: 32px;
}

.close-btn {
  background: #2d2d44;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: #3d3d5a;
}

.coin-title {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  color: #ffffff;
}

.coin-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coin-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.coin-title h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ccc;
  margin: 0;
}

.coin-symbol {
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.coin-pair {
  background: #2d2d44;
  color: #d1d5db;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
}

.price-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 24px;
  background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%);
  border-radius: 12px;
  border: 1px solid #3d3d5a;
}

.current-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.price {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
}

.price-change {
  font-size: 20px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
}

.price-change.positive {
  color: #059669;
  background: #d1fae5;
}

.price-change.negative {
  color: #dc2626;
  background: #fee2e2;
}

.last-updated {
  color: #d1d5db;
  font-size: 14px;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #2d2d44;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #4d4d6a;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.stat-card h3 {
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
}

.stat-change.positive {
  color: #059669;
}

.stat-change.negative {
  color: #dc2626;
}

.performance-section {
  background: #2d2d44;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #4d4d6a;
}

.performance-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 20px 0;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.performance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #1a1a2e;
  border-radius: 8px;
  border: 1px solid #3d3d5a;
  transition: all 0.3s ease;
}

.performance-item:hover {
  border-color: #3b82f6;
  background: #2d2d44;
  transform: translateX(4px);
}

.period {
  font-weight: 500;
  color: #9ca3af;
}

.change {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.change.positive {
  color: #059669;
  background: #d1fae5;
}

.change.negative {
  color: #dc2626;
  background: #fee2e2;
}

@media (max-width: 768px) {
  .coin-detail {
    padding: 16px;
  }

  .coin-title h1 {
  font-size: 24px;
}



  .price {
    font-size: 36px;
  }

  .current-price {
    flex-direction: column;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .performance-grid {
    grid-template-columns: 1fr;
  }
}
</style>
