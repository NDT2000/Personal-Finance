# Personal Finance Management System

A modern React-based personal finance application with ML-powered expense categorization, built with Express.js backend and TiDB Cloud database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- TiDB Cloud account

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd Personal-Finance
   npm install
   ```

2. **Configure database**
   Create `.env` file:
   ```env
   DB_HOST=your-tidb-host
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=personal_finance
   DB_PORT=4000
   ```

3. **Initialize database**
   ```bash
   node src/scripts/createDatabaseTables.js
   node src/scripts/updateDatabaseForML.js
   ```

4. **Start application**
   ```bash
   # Terminal 1: Backend
   npm run server
   
   # Terminal 2: Frontend
   npm run dev
   ```

5. **Access application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

## 🎯 Key Features

### 💰 Financial Management
- Multi-account support (checking, savings, credit, investment, cash)
- Real-time balance tracking
- Transaction history with search/filter
- Income/expense categorization

### 🤖 Machine Learning
- **Smart Categorization**: Auto-categorize expenses using TF-IDF pattern matching
- **Confidence Scoring**: ML predictions with confidence levels
- **Real-time Suggestions**: Live category suggestions as you type
- **Learning System**: Improves through user feedback

### 📊 Data Visualization
- Interactive financial charts
- Income vs expense comparisons
- Spending category breakdowns
- Monthly trend analysis

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Loading states and error handling
- Performance monitoring dashboard
- Real-time updates

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js + MySQL2
- **Database**: TiDB Cloud (MySQL-compatible)
- **ML**: JavaScript-based TF-IDF algorithm
- **Authentication**: Session-based with bcrypt

## 📁 Project Structure

```
├── server.js                 # Backend API server
├── src/
│   ├── components/          # React components
│   │   ├── Charts/          # Data visualization
│   │   ├── Goals/           # Financial goals
│   │   └── ML components    # ML integration
│   ├── pages/               # Application pages
│   ├── services/            # API & business logic
│   ├── hooks/               # Custom React hooks
│   └── scripts/             # Database management
└── package.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 ML Categories

The system automatically categorizes expenses into:
- **Housing** (rent, mortgage, property)
- **Food** (groceries, restaurants, delivery)
- **Transportation** (gas, rideshare, public transit)
- **Utilities** (electricity, water, internet, phone)
- **Healthcare** (medical, pharmacy, insurance)
- **Entertainment** (subscriptions, movies, games)
- **Shopping** (retail, online, clothing)
- **Other** (uncategorized)

## 🔒 Security Features

- Password hashing with bcrypt
- Secure session management
- SQL injection prevention
- Input validation & sanitization
- CORS configuration

## 📈 Performance

- Optimized database queries
- Efficient ML algorithms with caching
- Responsive UI with minimal re-renders
- Real-time updates without page refreshes
- Performance monitoring dashboard

## 🧪 Testing

```bash
# Test ML service
node test-ml.js

# Test API endpoints
# Use browser dev tools or Postman
```

## 📚 Documentation

- [Libraries & Dependencies](LIBRARIES.md) - Complete list of libraries and their uses
- [API Documentation](API.md) - Detailed API endpoint documentation
- [ML Documentation](ML.md) - Machine learning implementation details

## 🚀 Future Enhancements

- Bank API integration
- Advanced ML models
- Investment tracking
- Bill payment automation
- Financial goal setting
- Multi-user family accounts

## 📄 License

This project is licensed under the MIT License.