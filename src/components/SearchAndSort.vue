<template>
  <div class="search-sort-container">
    <div class="search-box">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search trading pairs..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
    </div>

    <div class="sort-controls">
      <label for="sort-field" class="sort-label">Sort by:</label>
              <select
          id="sort-field"
          v-model="sortField"
          class="sort-select"
          @change="handleSortChange"
        >
          <option value="primary">Cryptocurrency</option>
          <option value="last_price">Last Price</option>
          <option value="price_change_percent">Price Change %</option>
          <option value="volume_primary">Volume (Primary)</option>
          <option value="volume_secondary">Volume (Secondary)</option>
        </select>

      <button
        @click="toggleSortDirection"
        class="sort-direction-btn"
        :class="{ 'desc': sortDirection === 'desc' }"
        :title="`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`"
      >
        {{ sortDirection === 'asc' ? '↑' : '↓' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarketStore, type SortField, type SortDirection } from '@/stores/market';

const marketStore = useMarketStore();
const { searchQuery: storeSearchQuery, sortField: storeSortField, sortDirection: storeSortDirection } = storeToRefs(marketStore);

const searchQuery = ref(storeSearchQuery.value);
const sortField = ref<SortField>(storeSortField.value);
const sortDirection = ref<SortDirection>(storeSortDirection.value);

const handleSearch = () => {
  marketStore.setSearchQuery(searchQuery.value);
};

const handleSortChange = () => {
  marketStore.setSorting(sortField.value, sortDirection.value);
};

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  marketStore.setSorting(sortField.value, sortDirection.value);
};

// Watch for external changes to keep local state in sync
watch(storeSearchQuery, (newValue) => {
  searchQuery.value = newValue;
});

watch(storeSortField, (newValue) => {
  sortField.value = newValue;
});

watch(storeSortDirection, (newValue) => {
  sortDirection.value = newValue;
});
</script>

<style scoped>
.search-sort-container {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #3d3d5a;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #1a1a2e;
  color: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.search-input:hover {
  border-color: #4d4d6a;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #d1d5db;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.sort-label {
  font-weight: 500;
  color: #ffffff;
  white-space: nowrap;
}

.sort-select {
  padding: 10px 12px;
  border: 2px solid #3d3d5a;
  border-radius: 8px;
  font-size: 14px;
  background: #1a1a2e;
  color: #ffffff;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.sort-select:hover {
  border-color: #4d4d6a;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.sort-direction-btn {
  padding: 10px 12px;
  border: 2px solid #3d3d5a;
  border-radius: 8px;
  background: #1a1a2e;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  min-width: 44px;
}

.sort-direction-btn:hover {
  border-color: #3b82f6;
  background: #2d2d44;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

.sort-direction-btn.desc {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .search-sort-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .sort-controls {
    justify-content: space-between;
  }
}
</style>
