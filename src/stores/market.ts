import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type MarketData } from '@/services/api'

export type SortField =
  | 'primary'
  | 'last_price'
  | 'price_change_percent'
  | 'volume_primary'
  | 'volume_secondary'
export type SortDirection = 'asc' | 'desc'

export const useMarketStore = defineStore('market', () => {
  const marketData = ref<MarketData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const sortField = ref<SortField>('primary')
  const sortDirection = ref<SortDirection>('asc')
  const lastUpdated = ref<Date | null>(null)

  // Computed properties
  const filteredAndSortedData = computed(() => {
    if (!marketData.value || marketData.value.length === 0) return []

    let filtered = marketData.value

    // Apply search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (coin) =>
          coin.pair.primary.toLowerCase().includes(query) ||
          coin.pair.secondary.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField.value) {
        case 'primary':
          aValue = a.pair.primary.toLowerCase()
          bValue = b.pair.primary.toLowerCase()
          break
        case 'last_price':
          aValue = parseFloat(a.price.last)
          bValue = parseFloat(b.price.last)
          break
        case 'price_change_percent':
          aValue = parseFloat(a.price.change.percent)
          bValue = parseFloat(b.price.change.percent)
          break
        case 'volume_primary':
          aValue = parseFloat(a.volume.primary)
          bValue = parseFloat(b.volume.primary)
          break
        case 'volume_secondary':
          aValue = parseFloat(a.volume.secondary)
          bValue = parseFloat(b.volume.secondary)
          break
        default:
          aValue = a.pair.primary.toLowerCase()
          bValue = b.pair.primary.toLowerCase()
      }

      if (sortDirection.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  })

  const topGainers = computed(() => {
    if (!marketData.value || marketData.value.length === 0) return []
    return [...marketData.value]
      .filter((coin) => coin.price.change.direction === 'Up')
      .sort((a, b) => parseFloat(b.price.change.percent) - parseFloat(a.price.change.percent))
      .slice(0, 5)
  })

  const topLosers = computed(() => {
    if (!marketData.value || marketData.value.length === 0) return []
    return [...marketData.value]
      .filter((coin) => coin.price.change.direction === 'Down')
      .sort((a, b) => parseFloat(a.price.change.percent) - parseFloat(b.price.change.percent))
      .slice(0, 5)
  })

  const totalVolume = computed(() => {
    if (!marketData.value || marketData.value.length === 0) return 0
    return marketData.value.reduce((sum, coin) => sum + parseFloat(coin.volume.secondary), 0)
  })

  // Actions
  const fetchMarketData = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await apiService.fetchMarketData()
      marketData.value = data
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch market data'
      console.error('Error fetching market data:', err)
    } finally {
      loading.value = false
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSorting = (field: SortField, direction: SortDirection) => {
    sortField.value = field
    sortDirection.value = direction
  }

  const getCoinByPair = (primary: string, secondary: string) => {
    return marketData.value.find(
      (coin) => coin.pair.primary === primary && coin.pair.secondary === secondary,
    )
  }

  return {
    // State
    marketData,
    loading,
    error,
    searchQuery,
    sortField,
    sortDirection,
    lastUpdated,

    // Computed
    filteredAndSortedData,
    topGainers,
    topLosers,
    totalVolume,

    // Actions
    fetchMarketData,
    setSearchQuery,
    setSorting,
    getCoinByPair,
  }
})
