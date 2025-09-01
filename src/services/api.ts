export interface CurrencyConfig {
  code: string;
  sort_order: number;
  ticker: string;
  type: 'Primary' | 'Secondary';
  decimals_places: number;
  icon: string;
}

export interface TradingPair {
  primary: string;
  secondary: string;
}

export interface PriceChange {
  direction: 'Up' | 'Down';
  percent: string;
  amount: string;
}

export interface Price {
  last: string;
  bestBid: string;
  bestOffer: string;
  change: PriceChange;
}

export interface Volume {
  primary: string;
  secondary: string;
}

export interface MarketData {
  pair: TradingPair;
  price: Price;
  volume: Volume;
  priceHistory: string[];
}

class ApiService {
  async fetchCurrencyConfig(): Promise<CurrencyConfig[]> {
    try {
      const response = await fetch('/api/currency');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching currency config:', error);
      throw error;
    }
  }

  async fetchMarketData(): Promise<MarketData[]> {
    try {
      const response = await fetch('/api/market');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
