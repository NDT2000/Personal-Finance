# Personal-Finance

A React-based personal finance management application with TiDB Cloud database integration, built with Vite and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- TiDB Cloud account (for database)

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

3. **Start the backend server**
   ```bash
   npm run server
   ```
   This starts the database API server on `http://localhost:3001`

4. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   This starts the React app on `http://localhost:3000`

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - You'll be redirected to the login page
   - Register a new account or login with existing credentials

### Alternative: Run Both Servers Together
```bash
npm run dev:full
```
This command runs both the backend server and frontend development server simultaneously.

## 🏗️ Architecture

- **Frontend**: React with Vite and Tailwind CSS
- **Backend**: Express.js API server
- **Database**: TiDB Cloud (MySQL-compatible)
- **Authentication**: Database-based with session management

## 📁 Project Structure

```
├── server.js                 # Backend API server
├── src/
│   ├── pages/               # React pages
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   └── Dashboard.jsx    # Main dashboard
│   ├── services/
│   │   └── apiService.js    # API service for database operations
│   └── main.jsx             # React entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both servers together
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Features

- User registration and authentication
- Password reset functionality with email support
- Modern, responsive dashboard with beautiful UI
- **Interactive data visualizations** with Chart.js
- **Enhanced income tracking** with categories and insights
- **Multi-account management** with different account types
- **Database-driven transactions** with proper data persistence
- User profile management
- Database integration with TiDB Cloud
- Responsive design with Tailwind CSS
- Form validation and error handling
- Session management

## 🔐 Password Reset

The application includes a complete password reset flow:

1. **Forgot Password**: Users can request a password reset by entering their email
2. **Email Notification**: Reset instructions are sent to the user's email (currently logged to console)
3. **Reset Password**: Users can set a new password using the reset token
4. **Token Security**: Reset tokens expire after 1 hour for security

### Password Reset Flow:
- Visit `/forgot-password` to request a reset
- Check the server console for the reset link (in development)
- Use the reset link to set a new password at `/reset-password`

## 🎨 Modern UI Features

The application now features a modern, responsive design with:

- **Gradient backgrounds** and smooth animations
- **Card-based layouts** with hover effects and shadows
- **Modern buttons** with gradient backgrounds and hover animations
- **Icon integration** using Heroicons for better visual appeal
- **Responsive design** that works on all device sizes
- **Profile management** with user information editing
- **Beautiful transaction cards** with color-coded income/expense indicators

### Navigation:
- **Dashboard** (`/dashboard`) - Main financial overview with interactive charts
- **Profile** (`/profile`) - User account management
- **Login/Register** - Authentication pages
- **Password Reset** - Forgot password functionality

## 📊 Data Visualizations

The dashboard now includes comprehensive financial analytics with interactive charts:

### 📈 **Chart Types**
- **Income vs Expenses Bar Chart** - Monthly comparison of income and expenses
- **Spending Categories Pie Chart** - Breakdown of expenses by category
- **Monthly Trends Line Chart** - Financial trends over time with balance tracking
- **Financial Summary Cards** - Key metrics including savings rate and averages

### 🎨 **Visual Features**
- **Interactive tooltips** with detailed information
- **Responsive design** that works on all screen sizes
- **Color-coded data** for easy interpretation
- **Smooth animations** and hover effects
- **Real-time updates** when transactions are added/modified

### 📋 **Smart Categorization**
The system automatically categorizes both income and expenses:

**Income Categories:**
- **Salary** (wages, pay, salary)
- **Freelance** (contract work, consulting)
- **Bonus** (incentives, bonuses)
- **Investment** (returns, dividends)
- **Business** (profit, revenue)
- **Other** (uncategorized income)

**Expense Categories:**
- **Housing** (rent, mortgage, utilities)
- **Food & Dining** (groceries, restaurants)
- **Transportation** (gas, car, rideshare)
- **Healthcare** (medical, pharmacy)
- **Entertainment** (movies, games, subscriptions)
- **Shopping** (clothes, fashion)
- **Other** (uncategorized expenses)

## 💰 Enhanced Income Features

The application now includes comprehensive income tracking and management:

### 🎯 **Income Management**
- **Visual Transaction Toggle** - Easy switching between income and expense entry
- **Income Categories** - Organized income tracking by source type
- **Quick Add Income Button** - One-click access to add income transactions
- **Smart Placeholders** - Context-aware input suggestions

### 📊 **Income Analytics**
- **Income Insights Dashboard** - Dedicated income analytics section
- **Total Income Tracking** - All-time earnings summary
- **Average Monthly Income** - Calculated from transaction history
- **Top Income Source** - Identifies primary income category
- **Income Growth Tracking** - Month-over-month growth analysis

### 🎨 **Enhanced UX**
- **Color-coded Interface** - Green for income, red for expenses
- **Dynamic Button Text** - Changes based on transaction type
- **Category Dropdowns** - Separate categories for income vs expenses
- **Visual Feedback** - Icons and colors for better user experience

## 🏦 Database Structure

The application now uses a comprehensive database structure to store all user data:

### 📊 **Database Tables**
- **Users** - User accounts with authentication and preferences
- **Accounts** - Multiple account types (checking, savings, credit, investment, cash)
- **Transactions** - All financial transactions linked to accounts
- **Password Reset Tokens** - Secure password reset functionality

### 🏗️ **Account Management**
- **Multiple Account Types** - Checking, Savings, Credit Card, Investment, Cash
- **Account Selection** - Choose which account to add transactions to
- **Balance Tracking** - Real-time balance updates with each transaction
- **Account Creation** - Easy account setup with initial balance

### 💾 **Data Persistence**
- **Database Storage** - All data stored in TiDB Cloud database
- **Transaction History** - Complete transaction history with account tracking
- **Real-time Updates** - Account balances update automatically
- **Data Integrity** - Proper foreign key relationships and constraints

### 🔄 **Transaction System**
- **Account-linked Transactions** - All transactions tied to specific accounts
- **Automatic Balance Updates** - Account balances update with each transaction
- **Transaction Categories** - Organized by income/expense categories
- **Date Tracking** - Full transaction date and time tracking