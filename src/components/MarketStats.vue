<template>
  <div class="market-stats">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3 class="stat-title">Total Trading Pairs</h3>
          <p class="stat-value">{{ marketData.length }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3 class="stat-title">24h Volume</h3>
          <p class="stat-value">${{ formatNumber(totalVolume) }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🪙</div>
        <div class="stat-content">
          <h3 class="stat-title">Unique Cryptocurrencies</h3>
          <p class="stat-value">{{ uniqueCryptocurrencies }}</p>
        </div>
      </div>

      <div class="stat-card last-updated-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <h3 class="stat-title">Last Updated</h3>
          <p class="stat-value">{{ formatLastUpdated }}</p>
        </div>
        <div v-if="formatLastUpdated === 'Just now'" class="live-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarketStore } from '@/stores/market';

const marketStore = useMarketStore();
const { totalVolume, marketData, lastUpdated } = storeToRefs(marketStore);

const uniqueCryptocurrencies = computed(() => {
  if (!marketData.value || marketData.value.length === 0) return 0;
  const unique = new Set(marketData.value.map(coin => coin.pair.primary));
  return unique.size;
});

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

const formatLastUpdated = computed(() => {
  if (!lastUpdated.value) return 'Never';

  const now = new Date();
  const diff = now.getTime() - lastUpdated.value.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return lastUpdated.value.toLocaleDateString();
});
</script>

<style scoped>
.market-stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #1a1a2e;
  color: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  position: relative;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  border: 1px solid #3d3d5a;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2);
}

.stat-icon {
  font-size: 32px;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #d1d5db;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 20px;
  }
}

.live-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
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
</style>
