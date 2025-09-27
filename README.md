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
- Database integration with TiDB Cloud
- Responsive design with Tailwind CSS
- Form validation and error handling
- Session management