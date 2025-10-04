# Libraries & Dependencies Documentation

This document provides a comprehensive overview of all libraries and dependencies used in the Personal Finance Management System, their purposes, and implementation details.

## 📦 Core Dependencies

### Frontend Libraries

#### **React & React Ecosystem**
- **react** (^18.2.0) - Core React library for building user interfaces
- **react-dom** (^18.2.0) - React DOM rendering
- **react-router-dom** (^6.8.1) - Client-side routing for single-page applications
  - Used for: Navigation between pages (Login, Dashboard, Profile)
  - Implementation: BrowserRouter, Routes, Route components

#### **Build Tools & Development**
- **vite** (^5.0.8) - Fast build tool and development server
  - Purpose: Lightning-fast HMR (Hot Module Replacement)
  - Configuration: Custom Vite config for React + Tailwind CSS
- **@vitejs/plugin-react** (^4.2.1) - Vite plugin for React support
- **eslint** (^8.57.0) - JavaScript linting and code quality
- **eslint-plugin-react** (^7.34.1) - React-specific ESLint rules
- **eslint-plugin-react-hooks** (^4.6.0) - ESLint rules for React Hooks

#### **Styling & UI**
- **tailwindcss** (^3.4.1) - Utility-first CSS framework
  - Purpose: Rapid UI development with utility classes
  - Usage: Responsive design, color schemes, spacing, typography
- **autoprefixer** (^10.4.16) - CSS vendor prefixing
- **postcss** (^8.4.32) - CSS transformation tool

### Backend Libraries

#### **Server Framework**
- **express** (^4.18.2) - Web application framework for Node.js
  - Purpose: RESTful API server, middleware handling
  - Usage: Authentication, CORS, JSON parsing, route handling

#### **Database Integration**
- **mysql2** (^3.6.5) - MySQL client for Node.js
  - Purpose: Database connection and query execution
  - Features: Connection pooling, prepared statements, async/await support
  - Usage: TiDB Cloud integration, transaction management

#### **Security & Authentication**
- **bcryptjs** (^2.4.3) - Password hashing library
  - Purpose: Secure password storage and verification
  - Implementation: Salt rounds for password hashing
- **crypto** (Node.js built-in) - Cryptographic functionality
  - Purpose: Password reset token generation
  - Usage: Random token creation for secure password resets

#### **Middleware & Utilities**
- **cors** (^2.8.5) - Cross-Origin Resource Sharing middleware
  - Purpose: Enable cross-origin requests from frontend
  - Configuration: Allow credentials, specific origins
- **body-parser** (^1.20.2) - Request body parsing middleware
  - Purpose: Parse JSON and URL-encoded request bodies
  - Usage: API endpoint data handling

## 🎨 UI/UX Libraries

### **Chart & Visualization**
- **chart.js** (^4.4.0) - Charting library for data visualization
  - Purpose: Financial charts and graphs
  - Usage: Income/expense charts, spending categories, trends
- **react-chartjs-2** (^5.2.0) - React wrapper for Chart.js
  - Purpose: React integration with Chart.js
  - Components: Line, Bar, Pie, Doughnut charts

### **Icons & Graphics**
- **lucide-react** (^0.263.1) - Icon library
  - Purpose: Consistent iconography throughout the application
  - Usage: Navigation icons, action buttons, status indicators

## 🔧 Development Dependencies

### **Build & Compilation**
- **@types/react** (^18.2.43) - TypeScript definitions for React
- **@types/react-dom** (^18.2.17) - TypeScript definitions for React DOM
- **typescript** (^5.2.2) - TypeScript compiler
  - Purpose: Type safety and enhanced development experience

### **Testing & Quality**
- **@testing-library/react** (^13.4.0) - React testing utilities
- **@testing-library/jest-dom** (^5.17.0) - Custom Jest matchers
- **@testing-library/user-event** (^14.5.1) - User interaction testing
- **vitest** (^1.0.4) - Fast unit testing framework
  - Purpose: Component testing, API testing, ML service testing

## 🤖 Machine Learning Libraries

### **Custom ML Implementation**
- **JavaScript-based TF-IDF Algorithm** - Custom implementation
  - Purpose: Text-based expense categorization
  - Features: Pattern matching, confidence scoring, batch processing
  - Categories: 8 expense categories with keyword patterns

### **ML Service Architecture**
```javascript
// Core ML components
- mlService.js - Main ML service class
- Pattern matching algorithms
- Confidence scoring system
- Synthetic data generation
- Model performance tracking
```

## 📊 Data Management Libraries

### **State Management**
- **React Hooks** - Built-in state management
  - useState: Component state management
  - useEffect: Side effects and lifecycle management
  - useCallback: Performance optimization
  - useMemo: Expensive calculation memoization

### **API Integration**
- **Fetch API** - Native browser API
  - Purpose: HTTP requests to backend
  - Usage: RESTful API communication
  - Features: Promise-based, async/await support

## 🔒 Security Libraries

### **Authentication & Authorization**
- **bcryptjs** - Password hashing
  - Salt rounds: 12 (configurable)
  - Purpose: Secure password storage
- **crypto** - Token generation
  - Purpose: Password reset tokens
  - Implementation: Random bytes with expiration

### **Data Validation**
- **Input Sanitization** - Custom implementation
  - Purpose: Prevent XSS and injection attacks
  - Usage: Form validation, API input cleaning

## 📈 Performance Libraries

### **Optimization Tools**
- **React.memo** - Component memoization
- **useCallback** - Function memoization
- **useMemo** - Value memoization
- **Custom Performance Hooks** - Performance monitoring

### **Caching & Storage**
- **Browser LocalStorage** - Client-side storage
- **Session Management** - Server-side sessions
- **ML Prediction Caching** - Custom caching system

## 🌐 Network & Communication

### **HTTP & API**
- **Express.js** - Server framework
- **CORS** - Cross-origin resource sharing
- **JSON** - Data serialization
- **RESTful API** - API design pattern

### **Real-time Features**
- **Polling** - Data refresh mechanism
- **State Updates** - Real-time UI updates
- **WebSocket Ready** - Future real-time features

## 🧪 Testing Libraries

### **Unit Testing**
- **Vitest** - Fast testing framework
- **React Testing Library** - Component testing
- **Jest DOM** - DOM testing utilities
- **User Event** - User interaction simulation

### **API Testing**
- **Custom Test Scripts** - ML service testing
- **Database Testing** - Connection and query testing
- **Integration Testing** - End-to-end testing

## 📱 Responsive Design Libraries

### **CSS Framework**
- **Tailwind CSS** - Utility-first CSS
  - Responsive design utilities
  - Color system and theming
  - Spacing and typography
  - Component styling

### **Layout & Grid**
- **CSS Grid** - Modern layout system
- **Flexbox** - Flexible box layout
- **Responsive Breakpoints** - Mobile-first design

## 🔧 Utility Libraries

### **Date & Time**
- **JavaScript Date API** - Native date handling
- **Moment.js Alternative** - Custom date utilities
- **Timezone Handling** - User timezone support

### **Data Processing**
- **Array Methods** - Native JavaScript
- **Object Manipulation** - Spread operator, destructuring
- **String Processing** - Text manipulation for ML

## 📊 Analytics & Monitoring

### **Performance Monitoring**
- **Custom Performance Hooks** - React performance tracking
- **Console Logging** - Development debugging
- **Error Tracking** - Error boundary implementation

### **User Analytics**
- **Custom Analytics** - User interaction tracking
- **ML Performance Metrics** - Model accuracy tracking
- **Usage Statistics** - Feature usage monitoring

## 🚀 Deployment Libraries

### **Build Optimization**
- **Vite** - Fast build tool
- **Tree Shaking** - Dead code elimination
- **Code Splitting** - Lazy loading
- **Asset Optimization** - Image and CSS optimization

### **Production Features**
- **Environment Variables** - Configuration management
- **Error Boundaries** - Error handling
- **Loading States** - User experience
- **Progressive Enhancement** - Accessibility

## 📚 Documentation Libraries

### **Code Documentation**
- **JSDoc** - JavaScript documentation
- **README Generation** - Automated documentation
- **API Documentation** - Endpoint documentation
- **Component Documentation** - React component docs

## 🔄 Version Control & Development

### **Git Integration**
- **Git Hooks** - Pre-commit validation
- **Linting** - Code quality enforcement
- **Formatting** - Code style consistency

### **Development Workflow**
- **Hot Module Replacement** - Fast development
- **Live Reloading** - Real-time updates
- **Source Maps** - Debugging support
- **Development Server** - Local development

## 📋 Library Usage Summary

| Category | Library | Purpose | Implementation |
|----------|---------|---------|----------------|
| **Frontend** | React 18 | UI Framework | Component-based architecture |
| **Styling** | Tailwind CSS | CSS Framework | Utility-first styling |
| **Backend** | Express.js | Server Framework | RESTful API |
| **Database** | MySQL2 | Database Client | TiDB Cloud integration |
| **Security** | bcryptjs | Password Hashing | Secure authentication |
| **Charts** | Chart.js | Data Visualization | Financial charts |
| **ML** | Custom JS | ML Algorithm | TF-IDF categorization |
| **Testing** | Vitest | Testing Framework | Unit and integration tests |
| **Build** | Vite | Build Tool | Fast development and building |

## 🎯 Library Selection Rationale

### **Why These Libraries?**
1. **Performance**: Vite for fast builds, React 18 for optimal rendering
2. **Developer Experience**: Tailwind CSS for rapid UI development
3. **Security**: bcryptjs for secure password handling
4. **Scalability**: Express.js for robust API development
5. **Maintainability**: Well-documented, actively maintained libraries
6. **Compatibility**: MySQL2 for TiDB Cloud integration
7. **User Experience**: Chart.js for rich data visualization

### **Future Considerations**
- **TypeScript**: Gradual migration for type safety
- **State Management**: Redux Toolkit for complex state
- **Testing**: Playwright for E2E testing
- **Monitoring**: Sentry for error tracking
- **Analytics**: Google Analytics integration

This comprehensive library setup provides a solid foundation for a modern, scalable, and maintainable personal finance application with machine learning capabilities.
