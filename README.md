# Cryptocurrency Market Dashboard

A modern Vue 3 application for displaying real-time cryptocurrency market data with a beautiful user interface and advanced trading features.

## 🚀 Features

### Core Functionality

- **Real-time Market Data**: Live cryptocurrency data from external APIs
- **Auto-refresh**: Configurable automatic updates every 10 seconds
- **Interactive Trading Pairs**: Click any cryptocurrency for detailed information
- **Search & Filter**: Find cryptocurrencies by name or symbol
- **Advanced Sorting**: Sort by price, volume, change percentage, and more

### Market Overview

- **Market Statistics**: Total trading pairs, volume, and unique cryptocurrencies
- **Top Movers**: Best and worst performing cryptocurrencies
- **Performance Metrics**: Price changes and volume statistics
- **Live Updates**: Real-time data with visual indicators

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error messages with retry options
- **Dark Theme**: Eye-friendly dark color scheme

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia
- **TypeScript**: Full type safety
- **Build Tool**: Vite
- **Styling**: Modern CSS with responsive design
- **Deployment**: Vercel

## 📁 Project Structure

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
├── router/
│   └── index.ts                # Vue Router configuration
└── main.ts                     # Application entry point
```

## 🔌 API Integration

The application integrates with cryptocurrency data APIs:

- **Currency Configuration**: `/api/currency` - Currency metadata and icons
- **Market Data**: `/api/market` - Real-time trading data and prices

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
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

## 📊 Features in Detail

### Search & Filtering

- Real-time search across cryptocurrency names and symbols
- Instant filtering as you type
- Clear visual feedback for search results

### Sorting Options

- **Primary**: Alphabetical sorting by cryptocurrency name
- **Last Price**: Current price (ascending/descending)
- **Price Change**: 24h price change percentage
- **Volume Primary**: Trading volume in primary currency
- **Volume Secondary**: Trading volume in secondary currency

### Real-time Updates

- Manual refresh button with loading states
- Optional auto-refresh every 10 seconds
- Visual indicators for live updates
- Prevents unnecessary API calls during loading

### Responsive Design

- **Desktop**: Multi-column grid layout with full feature set
- **Tablet**: Optimized grid with touch-friendly interactions
- **Mobile**: Single-column layout with simplified navigation

### Error Handling

- Network error detection and user-friendly messages
- Retry functionality for failed requests
- Graceful degradation when APIs are unavailable

## 🎨 UI Components

### CryptoCard

- Displays trading pair information
- Shows current price and 24h change
- Mini price chart visualization
- Bid/Ask prices and volume data

### CoinDetail

- Comprehensive cryptocurrency information
- Detailed price statistics
- Volume and trading data
- Price history visualization

### MarketStats

- Total trading pairs count
- 24h volume statistics
- Unique cryptocurrencies count
- Last update timestamp

## 🔧 Configuration

### Development

The development server uses Vite proxy configuration to forward API requests to external endpoints.

### Production

Production deployment on Vercel uses rewrite rules to handle API routing and SPA fallback.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interactions
- Optimized layouts for mobile devices

## 🚀 Performance Features

- **Efficient State Management**: Pinia stores with computed properties
- **Lazy Loading**: Components loaded only when needed
- **Optimized Rendering**: Vue 3's reactivity system for minimal re-renders
- **Debounced Search**: Prevents excessive API calls during typing

## 🧪 Testing

- Unit tests with Vitest
- Component testing with Vue Test Utils
- ESLint for code quality
- Prettier for code formatting

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Pinia for state management
- Vite for fast development experience
- The cryptocurrency community for data APIs

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include browser console logs if applicable

---

**Made with ❤️ using Vue 3 and modern web technologies**
