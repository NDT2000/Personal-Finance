# Personal Finance Management System

A comprehensive React-based personal finance management application with machine learning-powered expense categorization, built with modern web technologies and TiDB Cloud database integration.

## Overview

This application provides a complete personal finance management solution with intelligent expense categorization using machine learning algorithms. The system features a modern React frontend, Express.js backend, and MySQL-compatible database integration.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- TiDB Cloud account for database hosting
- Modern web browser with JavaScript enabled

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Personal-Finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with your database credentials:
   ```env
   DB_HOST=your-tidb-host
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=personal_finance
   DB_PORT=4000
   ```

4. **Initialize the database**
   ```bash
   node src/scripts/createDatabaseTables.js
   node src/scripts/updateDatabaseForML.js
   ```

5. **Start the backend server**
   ```bash
   npm run server
   ```
   This starts the database API server on `http://localhost:3001`

6. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   This starts the React application on `http://localhost:3000`

7. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Register a new account or login with existing credentials
   - Begin managing your personal finances

### Alternative: Run Both Servers Together
```bash
npm run dev:full
```
This command runs both the backend server and frontend development server simultaneously.

## Architecture

- **Frontend**: React 18 with Vite build tool and Tailwind CSS
- **Backend**: Express.js API server with MySQL integration
- **Database**: TiDB Cloud (MySQL-compatible cloud database)
- **Authentication**: Database-based session management
- **Machine Learning**: JavaScript-based ML service for expense categorization

## Project Structure

```
├── server.js                     # Backend API server
├── src/
│   ├── components/              # React components
│   │   ├── Charts/             # Data visualization components
│   │   └── MLTestComponent.jsx   # ML testing interface
│   ├── pages/                  # Application pages
│   │   ├── Login.jsx          # User authentication
│   │   ├── Register.jsx       # User registration
│   │   ├── Dashboard.jsx      # Main financial dashboard
│   │   └── Profile.jsx        # User profile management
│   ├── services/              # API and business logic
│   │   ├── apiService.js     # Database API integration
│   │   ├── authService.js    # Authentication services
│   │   ├── emailService.js   # Email notification services
│   │   └── mlService.js      # Machine learning service
│   ├── scripts/              # Database management scripts
│   │   ├── createDatabaseTables.js
│   │   └── updateDatabaseForML.js
│   └── main.jsx              # React application entry point
├── test-ml.js                # ML service testing script
└── package.json             # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both servers simultaneously
- `npm run build` - Build application for production
- `npm run preview` - Preview production build locally

## Core Features

### User Management
- Secure user registration and authentication
- Password reset functionality with email notifications
- User profile management with editable information
- Session-based authentication with automatic logout

### Financial Management
- Multi-account support (checking, savings, credit, investment, cash)
- Real-time balance tracking and updates
- Comprehensive transaction history with search and filtering
- Income and expense categorization with smart suggestions

### Machine Learning Integration
- **Intelligent Expense Categorization**: Automatic categorization using TF-IDF pattern matching
- **Confidence Scoring**: ML predictions include confidence levels for manual review
- **Smart Suggestions**: Real-time category suggestions as users type transaction descriptions
- **Learning System**: Model improves through user feedback and corrections

### Data Visualization
- Interactive financial charts and graphs
- Income vs expense comparisons
- Spending category breakdowns with pie charts
- Monthly trend analysis with line graphs
- Financial summary cards with key metrics

### Account Management
- Multiple account types with individual balance tracking
- Account creation and management interface
- Transaction linking to specific accounts
- Real-time balance updates across all accounts

## Machine Learning Features

### Expense Categorization System
The application includes a sophisticated ML-powered expense categorization system:

**Supported Categories:**
- Housing (rent, mortgage, property-related expenses)
- Food & Dining (groceries, restaurants, food delivery)
- Transportation (gas, rideshare, public transit, car maintenance)
- Utilities (electricity, water, internet, phone bills)
- Healthcare (medical visits, pharmacy, insurance)
- Entertainment (subscriptions, movies, games, events)
- Shopping (retail purchases, online shopping, clothing)
- Other (uncategorized expenses)

**ML Algorithm Features:**
- TF-IDF-based pattern matching for accurate categorization
- Confidence scoring (0-100%) for each prediction
- Automatic threshold-based manual review system
- Batch processing capabilities for multiple transactions
- Real-time prediction API endpoints

**Model Performance:**
- Target accuracy: 80%+ on common transaction types
- Response time: <100ms per prediction
- Confidence threshold: 70% for auto-acceptance
- Training data: 50+ synthetic examples with keyword patterns

## Database Structure

### Core Tables
- **Users**: User accounts with authentication credentials and preferences
- **Accounts**: Multiple account types with balance tracking
- **Transactions**: Financial transactions linked to specific accounts
- **Password Reset Tokens**: Secure password reset functionality

### Machine Learning Tables
- **ml_training_data**: Training examples for ML model improvement
- **ml_models**: Model metadata and performance tracking
- **ML-enhanced transactions**: Additional columns for ML predictions and confidence scores

### Data Integrity
- Foreign key relationships ensuring data consistency
- Automatic balance updates with transaction changes
- Transaction history preservation with audit trails
- Secure password storage with proper hashing

## API Endpoints

### Authentication
- `POST /api/auth` - User login
- `POST /api/sync-user` - User registration
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset completion

### Financial Management
- `GET /api/accounts/:userId` - Get user accounts
- `POST /api/accounts` - Create new account
- `GET /api/transactions/:accountId` - Get account transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:transactionId` - Delete transaction

### Machine Learning
- `POST /api/ml/categorize` - Get ML category predictions
- `GET /api/ml/info` - Get model information
- `PUT /api/transactions/:id/ml` - Update transaction with ML prediction
- `GET /api/ml/review` - Get transactions needing manual review
- `GET /api/ml/test` - Test ML model performance

### Dashboard
- `GET /api/dashboard/:userId` - Get comprehensive dashboard data

## Security Features

- Password hashing using bcrypt
- Secure session management
- Password reset tokens with expiration
- SQL injection prevention with parameterized queries
- Input validation and sanitization
- CORS configuration for API security

## Development and Testing

### ML Service Testing
```bash
node test-ml.js
```
This script tests the machine learning service functionality and validates prediction accuracy.

### Database Management
```bash
node src/scripts/createDatabaseTables.js
node src/scripts/updateDatabaseForML.js
```
These scripts initialize the database schema and ML-specific tables.

### API Testing
The application includes comprehensive API endpoints for testing all functionality, including ML predictions and financial data management.

## Performance Considerations

- Optimized database queries with proper indexing
- Efficient ML prediction algorithms with caching
- Responsive UI with minimal re-renders
- Real-time updates without full page refreshes
- Batch processing for multiple ML predictions

## Future Enhancements

- Bank API integration for automatic transaction import
- Advanced ML models with neural networks
- Investment portfolio tracking
- Bill payment automation
- Financial goal setting and tracking
- Multi-user family account management