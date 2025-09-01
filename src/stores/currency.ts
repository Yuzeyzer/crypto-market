import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService, type CurrencyConfig } from '@/services/api';

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref<CurrencyConfig[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currencyMap = computed(() => {
    return currencies.value.reduce((map, currency) => {
      map[currency.code] = currency;
      return map;
    }, {} as Record<string, CurrencyConfig>);
  });

  const fetchCurrencies = async () => {
    loading.value = true;
    error.value = null;

    try {
      currencies.value = await apiService.fetchCurrencyConfig();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch currencies';
      console.error('Error fetching currencies:', err);
    } finally {
      loading.value = false;
    }
  };

  const getCurrencyByCode = (code: string) => {
    return currencyMap.value[code];
  };

  return {
    currencies,
    loading,
    error,
    currencyMap,
    fetchCurrencies,
    getCurrencyByCode
  };
});
