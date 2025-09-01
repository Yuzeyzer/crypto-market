<template>
  <div class="crypto-dashboard">
    <CoinDetail v-if="selectedCoin" :coin="selectedCoin" @close="closeCoinDetail" />

    <div v-else>
      <div class="dashboard-header">
        <h1 class="dashboard-title">Cryptocurrency Trading Dashboard</h1>
        <div class="refresh-controls">
          <button @click="refreshData" class="refresh-btn" :disabled="loading">
            <span v-if="loading" class="loading-spinner">⟳</span>
            <span v-else>🔄</span>
            {{ loading ? 'Updating...' : 'Refresh' }}
          </button>
          <div class="auto-refresh">
            <label class="auto-refresh-label">
              <input v-model="autoRefresh" type="checkbox" class="auto-refresh-checkbox" />
              Auto-refresh (10s)
            </label>
          </div>
          <div v-if="autoRefresh" class="live-status">
            <span class="live-dot"></span>
            Live updates
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <p>{{ error }}</p>
          <button @click="refreshData" class="retry-btn">Retry</button>
        </div>
      </div>

      <MarketStats v-if="!loading && !error" />

      <TopMovers v-if="!loading && !error" @coin-click="handleCoinClick" />

      <SearchAndSort v-if="!loading && !error" />

      <div v-if="loading && marketData.length === 0" class="loading-container">
        <div class="loading-spinner large">⟳</div>
        <p>Loading trading data...</p>
      </div>

      <div v-else-if="!loading && !error" class="crypto-grid">
        <CryptoCard
          v-for="coin in filteredAndSortedData"
          :key="`${coin.pair.primary}-${coin.pair.secondary}`"
          :coin="coin"
          @click="handleCoinClick"
        />
      </div>

      <div v-if="!loading && !error && filteredAndSortedData.length === 0" class="no-results">
        <div class="no-results-content">
          <span class="no-results-icon">🔍</span>
          <h3>No trading pairs found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/stores/market'
import { useCurrencyStore } from '@/stores/currency'
import type { MarketData } from '@/services/api'
import MarketStats from './MarketStats.vue'
import TopMovers from './TopMovers.vue'
import SearchAndSort from './SearchAndSort.vue'
import CryptoCard from './CryptoCard.vue'
import CoinDetail from './CoinDetail.vue'

const marketStore = useMarketStore()
const currencyStore = useCurrencyStore()

// Use storeToRefs to maintain reactivity
const { marketData, loading, error, filteredAndSortedData } = storeToRefs(marketStore)

const autoRefresh = ref(true) // Включаем автоматическое обновление по умолчанию
let refreshInterval: number | null = null
const selectedCoin = ref<MarketData | null>(null)

const refreshData = async () => {
  await Promise.all([marketStore.fetchMarketData(), currencyStore.fetchCurrencies()])
}

const handleCoinClick = (coin: MarketData) => {
  selectedCoin.value = coin
}

const closeCoinDetail = () => {
  selectedCoin.value = null
}

const startAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }

  refreshInterval = setInterval(() => {
    if (!loading.value) {
      refreshData() // Обновляем и рынок, и валюты
    }
  }, 10000) // 10 seconds - более частое обновление
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

watch(autoRefresh, (enabled) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})

onMounted(async () => {
  await refreshData()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.crypto-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #0f0f23;
  color: #ffffff;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.refresh-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 16px;
}

.loading-spinner.large {
  font-size: 48px;
  color: #667eea;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.auto-refresh-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.auto-refresh-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #10b981;
  font-weight: 500;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.error-message {
  background: #1f1f2e;
  border: 1px solid #dc2626;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 20px;
}

.error-content p {
  flex: 1;
  margin: 0;
  color: #dc2626;
  font-weight: 500;
}

.retry-btn {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: #b91c1c;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.loading-container p {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 500;
}

.crypto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.no-results-content {
  text-align: center;
  color: #9ca3af;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.no-results-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #374151;
}

.no-results-content p {
  font-size: 16px;
  margin: 0;
}

@media (max-width: 768px) {
  .crypto-dashboard {
    padding: 16px;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }

  .refresh-controls {
    justify-content: space-between;
  }

  .crypto-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
