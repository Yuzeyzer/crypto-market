# Cryptocurrency Market Dashboard

A modern Vue 3 application for displaying real-time cryptocurrency market data with a beautiful, responsive user interface.

## Features

### 🚀 Core Functionality
- **Real-time Market Data**: Fetches live cryptocurrency data from provided APIs
- **Auto-refresh**: Optional 30-second polling for up-to-date information
- **Search & Filter**: Find cryptocurrencies by name or symbol
- **Advanced Sorting**: Sort by market cap, price, volume, and more
- **Detailed Views**: Click any cryptocurrency for comprehensive details

### 📊 Market Overview
- **Market Statistics**: Total market cap, 24h volume, active cryptocurrencies
- **Top Movers**: Best and worst performing cryptocurrencies in 24h
- **Performance Metrics**: 7-day and 30-day price changes
- **All-time Highs/Lows**: Historical price information

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error messages with retry options
- **Accessibility**: Keyboard navigation and screen reader support

## Technology Stack

- **Vue 3** with Composition API
- **Pinia** for state management
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Modern CSS** with responsive design

## Project Structure

```
src/
├── components/
│   ├── CryptoCard.vue          # Individual cryptocurrency card
│   ├── CryptoDashboard.vue     # Main dashboard component
│   ├── CoinDetail.vue          # Detailed cryptocurrency view
│   ├── MarketStats.vue         # Market overview statistics
│   ├── SearchAndSort.vue       # Search and sorting controls
│   └── TopMovers.vue           # Top gainers and losers
├── services/
│   └── api.ts                  # API service layer
├── stores/
│   ├── currency.ts             # Currency configuration store
│   └── market.ts               # Market data store
└── main.ts                     # Application entry point
```

## API Integration

The application integrates with two provided APIs:

1. **Currency Configuration API**: `https://user26614.requestly.tech/test/api/currency`
2. **Market Data API**: `https://user26614.requestly.tech/test/api/market`

## Getting Started

### Prerequisites
- Node.js (v20.19.0 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd crypto-market
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test:unit` - Run unit tests

## Features in Detail

### Search & Filtering
- Real-time search across cryptocurrency names and symbols
- Instant filtering as you type
- Clear visual feedback for search results

### Sorting Options
- **Market Cap Rank**: Default sorting by market capitalization
- **Name**: Alphabetical sorting
- **Price**: Current price (ascending/descending)
- **24h Change**: Price change percentage
- **Market Cap**: Total market capitalization
- **Volume**: 24-hour trading volume

### Real-time Updates
- Manual refresh button with loading states
- Optional auto-refresh every 30 seconds
- Visual indicators for last update time
- Prevents unnecessary API calls during loading

### Responsive Design
- **Desktop**: Multi-column grid layout with full feature set
- **Tablet**: Optimized grid with touch-friendly interactions
- **Mobile**: Single-column layout with simplified navigation

### Error Handling
- Network error detection and user-friendly messages
- Retry functionality for failed requests
- Graceful degradation when APIs are unavailable

## Performance Optimizations

- **Efficient State Management**: Pinia stores with computed properties
- **Lazy Loading**: Components loaded only when needed
- **Debounced Search**: Prevents excessive API calls during typing
- **Optimized Rendering**: Vue 3's reactivity system for minimal re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.