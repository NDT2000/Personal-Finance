// Advanced Regression Service for Financial Predictions
// Implements multiple regression algorithms for financial forecasting

class RegressionService {
  constructor() {
    this.models = new Map()
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Linear Regression for trend analysis
  linearRegression(x, y) {
    if (x.length !== y.length || x.length < 2) {
      throw new Error('Invalid data: arrays must have same length and at least 2 points')
    }

    const n = x.length
    const sumX = x.reduce((sum, val) => sum + val, 0)
    const sumY = y.reduce((sum, val) => sum + val, 0)
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
    const sumXX = x.reduce((sum, val) => sum + val * val, 0)

    // Calculate slope and intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Calculate R-squared
    const yMean = sumY / n
    const ssRes = y.reduce((sum, val, i) => sum + Math.pow(val - (slope * x[i] + intercept), 2), 0)
    const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0)
    const rSquared = 1 - (ssRes / ssTot)

    return {
      slope,
      intercept,
      rSquared,
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(2)}`,
      predict: (xValue) => slope * xValue + intercept
    }
  }

  // Polynomial Regression for non-linear trends
  polynomialRegression(x, y, degree = 2) {
    if (x.length !== y.length || x.length < degree + 1) {
      throw new Error('Invalid data for polynomial regression')
    }

    const n = x.length
    const matrix = []
    
    // Create Vandermonde matrix
    for (let i = 0; i < n; i++) {
      const row = []
      for (let j = 0; j <= degree; j++) {
        row.push(Math.pow(x[i], j))
      }
      matrix.push(row)
    }

    // Solve using normal equations (simplified)
    const coefficients = this.solveNormalEquations(matrix, y)
    
    return {
      coefficients,
      degree,
      predict: (xValue) => {
        let result = 0
        for (let i = 0; i <= degree; i++) {
          result += coefficients[i] * Math.pow(xValue, i)
        }
        return result
      }
    }
  }

  // Exponential Regression for growth patterns
  exponentialRegression(x, y) {
    if (x.length !== y.length || x.length < 2) {
      throw new Error('Invalid data for exponential regression')
    }

    // Transform y values to log space
    const logY = y.map(val => Math.log(Math.max(val, 0.001))) // Avoid log(0)
    
    // Perform linear regression on log-transformed data
    const linearResult = this.linearRegression(x, logY)
    
    const a = Math.exp(linearResult.intercept)
    const b = linearResult.slope

    return {
      a,
      b,
      rSquared: linearResult.rSquared,
      equation: `y = ${a.toFixed(4)} * e^(${b.toFixed(4)}x)`,
      predict: (xValue) => a * Math.exp(b * xValue)
    }
  }

  // Moving Average for smoothing trends
  movingAverage(data, windowSize = 3) {
    if (data.length < windowSize) return data

    const result = []
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const end = i + 1
      const window = data.slice(start, end)
      const average = window.reduce((sum, val) => sum + val, 0) / window.length
      result.push(average)
    }
    return result
  }

  // Financial-specific regression methods

  // Predict future spending based on historical data
  predictSpendingTrend(transactions, months = 6) {
    const monthlyData = this.groupTransactionsByMonth(transactions, months)
    const x = Array.from({ length: monthlyData.length }, (_, i) => i)
    const y = monthlyData.map(data => data.total)

    if (x.length < 2) {
      return {
        trend: 'insufficient_data',
        prediction: null,
        confidence: 0
      }
    }

    try {
      const linearModel = this.linearRegression(x, y)
      const exponentialModel = this.exponentialRegression(x, y)
      
      // Choose best model based on R-squared
      const bestModel = linearModel.rSquared > exponentialModel.rSquared ? 
        { ...linearModel, type: 'linear' } : 
        { ...exponentialModel, type: 'exponential' }

      // Predict next 3 months
      const predictions = []
      for (let i = 1; i <= 3; i++) {
        const nextMonth = x.length + i - 1
        const prediction = bestModel.predict(nextMonth)
        predictions.push({
          month: nextMonth,
          predictedAmount: Math.max(0, prediction),
          confidence: Math.min(bestModel.rSquared, 0.95)
        })
      }

      return {
        trend: bestModel.type,
        currentAverage: y.reduce((sum, val) => sum + val, 0) / y.length,
        predictions,
        model: bestModel,
        confidence: bestModel.rSquared
      }
    } catch (error) {
      return {
        trend: 'error',
        prediction: null,
        confidence: 0,
        error: error.message
      }
    }
  }

  // Predict income growth
  predictIncomeGrowth(incomeHistory, months = 12) {
    if (incomeHistory.length < 2) {
      return {
        trend: 'insufficient_data',
        growthRate: 0,
        predictions: []
      }
    }

    const x = Array.from({ length: incomeHistory.length }, (_, i) => i)
    const y = incomeHistory

    try {
      const linearModel = this.linearRegression(x, y)
      const growthRate = linearModel.slope / (y[0] || 1) // Percentage growth per period

      // Predict future income
      const predictions = []
      for (let i = 1; i <= months; i++) {
        const predictedIncome = linearModel.predict(x.length + i - 1)
        predictions.push({
          month: i,
          predictedIncome: Math.max(0, predictedIncome),
          confidence: linearModel.rSquared
        })
      }

      return {
        trend: linearModel.slope > 0 ? 'growing' : 'declining',
        growthRate: growthRate * 100, // Convert to percentage
        currentIncome: y[y.length - 1],
        predictions,
        confidence: linearModel.rSquared
      }
    } catch (error) {
      return {
        trend: 'error',
        growthRate: 0,
        predictions: [],
        error: error.message
      }
    }
  }

  // Predict goal achievement timeline
  predictGoalTimeline(goal, userProfile, historicalData) {
    const currentAmount = goal.current_amount || 0
    const targetAmount = goal.target_amount
    const remainingAmount = targetAmount - currentAmount

    if (remainingAmount <= 0) {
      return {
        timeline: 0,
        monthlyRequired: 0,
        probability: 1,
        confidence: 1
      }
    }

    // Analyze historical savings capacity
    const savingsCapacity = this.calculateHistoricalSavingsCapacity(historicalData)
    const savingsTrend = this.analyzeSavingsTrend(historicalData)

    // Predict future savings capacity
    const projectedMonthlySavings = this.projectSavingsCapacity(
      savingsCapacity, 
      savingsTrend, 
      userProfile
    )

    // Calculate timeline
    const monthsRequired = Math.ceil(remainingAmount / projectedMonthlySavings)
    const probability = this.calculateGoalProbability(goal, projectedMonthlySavings, monthsRequired)

    return {
      timeline: monthsRequired,
      monthlyRequired: projectedMonthlySavings,
      probability,
      confidence: savingsTrend.confidence,
      recommendations: this.generateTimelineRecommendations(goal, projectedMonthlySavings, monthsRequired)
    }
  }

  // Predict savings capacity with confidence intervals
  predictSavingsCapacity(incomeHistory, expenseHistory, months = 12) {
    if (incomeHistory.length < 2 || expenseHistory.length < 2) {
      return {
        currentCapacity: 0,
        projectedCapacity: 0,
        confidence: 0,
        trend: 'insufficient_data'
      }
    }

    // Analyze trends
    const incomeTrend = this.analyzeTrend(incomeHistory)
    const expenseTrend = this.analyzeTrend(expenseHistory)

    // Current capacity
    const currentIncome = incomeHistory[incomeHistory.length - 1]
    const currentExpenses = expenseHistory[expenseHistory.length - 1]
    const currentCapacity = currentIncome - currentExpenses

    // Project future capacity
    const projectedIncome = this.projectValue(currentIncome, incomeTrend, months)
    const projectedExpenses = this.projectValue(currentExpenses, expenseTrend, months)
    const projectedCapacity = projectedIncome - projectedExpenses

    // Calculate confidence based on data quality and trend consistency
    const confidence = this.calculatePredictionConfidence(incomeHistory, expenseHistory)

    return {
      currentCapacity,
      projectedCapacity,
      confidence,
      trend: {
        income: incomeTrend,
        expenses: expenseTrend
      },
      projections: this.generateMonthlyProjections(incomeHistory, expenseHistory, months)
    }
  }

  // Risk assessment using regression
  assessFinancialRisk(userProfile, goals, marketConditions = {}) {
    const risks = []

    // Income stability risk
    const incomeStability = this.calculateIncomeStability(userProfile.incomeHistory)
    if (incomeStability < 0.7) {
      risks.push({
        type: 'income_instability',
        severity: 'high',
        score: 1 - incomeStability,
        description: 'Income shows high volatility',
        mitigation: 'Consider diversifying income sources'
      })
    }

    // Savings capacity risk
    const savingsCapacity = userProfile.monthlySavingsCapacity || 0
    const requiredSavings = this.calculateRequiredSavings(goals)
    
    if (savingsCapacity < requiredSavings * 0.8) {
      risks.push({
        type: 'insufficient_savings',
        severity: 'high',
        score: 1 - (savingsCapacity / requiredSavings),
        description: 'Insufficient monthly savings capacity',
        mitigation: 'Increase income or reduce expenses'
      })
    }

    // Market risk (for investment goals)
    const investmentGoals = goals.filter(g => g.goal_type === 'investment')
    if (investmentGoals.length > 0 && marketConditions.volatility > 0.2) {
      risks.push({
        type: 'market_volatility',
        severity: 'medium',
        score: marketConditions.volatility,
        description: 'High market volatility may affect investment returns',
        mitigation: 'Consider more conservative investment strategies'
      })
    }

    return {
      overallRisk: this.calculateOverallRisk(risks),
      risks,
      recommendations: this.generateRiskMitigationRecommendations(risks)
    }
  }

  // Helper methods
  groupTransactionsByMonth(transactions, months) {
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - months)
    
    const monthlyData = {}
    transactions
      .filter(t => new Date(t.transaction_date) >= cutoffDate)
      .forEach(t => {
        const date = new Date(t.transaction_date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { total: 0, count: 0 }
        }
        
        monthlyData[monthKey].total += Math.abs(t.amount)
        monthlyData[monthKey].count += 1
      })

    return Object.values(monthlyData)
  }

  analyzeTrend(data) {
    if (data.length < 2) return { slope: 0, direction: 'stable', confidence: 0 }

    const x = Array.from({ length: data.length }, (_, i) => i)
    const linearModel = this.linearRegression(x, data)
    
    return {
      slope: linearModel.slope,
      direction: linearModel.slope > 0 ? 'increasing' : linearModel.slope < 0 ? 'decreasing' : 'stable',
      confidence: linearModel.rSquared,
      rSquared: linearModel.rSquared
    }
  }

  projectValue(currentValue, trend, periods) {
    return currentValue * Math.pow(1 + trend.slope / currentValue, periods)
  }

  calculatePredictionConfidence(incomeHistory, expenseHistory) {
    const incomeVolatility = this.calculateVolatility(incomeHistory)
    const expenseVolatility = this.calculateVolatility(expenseHistory)
    const dataPoints = Math.min(incomeHistory.length, expenseHistory.length)
    
    const volatilityScore = 1 - (incomeVolatility + expenseVolatility) / 2
    const dataScore = Math.min(dataPoints / 12, 1)
    
    return (volatilityScore + dataScore) / 2
  }

  calculateVolatility(data) {
    if (data.length < 2) return 0
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    return Math.sqrt(variance) / mean
  }

  generateMonthlyProjections(incomeHistory, expenseHistory, months) {
    const projections = []
    const incomeTrend = this.analyzeTrend(incomeHistory)
    const expenseTrend = this.analyzeTrend(expenseHistory)
    
    for (let i = 1; i <= months; i++) {
      const projectedIncome = this.projectValue(incomeHistory[incomeHistory.length - 1], incomeTrend, i)
      const projectedExpenses = this.projectValue(expenseHistory[expenseHistory.length - 1], expenseTrend, i)
      
      projections.push({
        month: i,
        projectedIncome,
        projectedExpenses,
        projectedSavings: projectedIncome - projectedExpenses
      })
    }
    
    return projections
  }

  calculateHistoricalSavingsCapacity(historicalData) {
    if (!historicalData.incomeHistory || !historicalData.expenseHistory) return 0
    
    const avgIncome = historicalData.incomeHistory.reduce((sum, val) => sum + val, 0) / historicalData.incomeHistory.length
    const avgExpenses = historicalData.expenseHistory.reduce((sum, val) => sum + val, 0) / historicalData.expenseHistory.length
    
    return avgIncome - avgExpenses
  }

  analyzeSavingsTrend(historicalData) {
    if (!historicalData.incomeHistory || !historicalData.expenseHistory) {
      return { slope: 0, confidence: 0 }
    }
    
    const savingsHistory = historicalData.incomeHistory.map((income, i) => 
      income - (historicalData.expenseHistory[i] || 0)
    )
    
    return this.analyzeTrend(savingsHistory)
  }

  projectSavingsCapacity(currentCapacity, trend, userProfile) {
    // Apply trend to project future capacity
    const projectedCapacity = currentCapacity * (1 + trend.slope / currentCapacity)
    
    // Apply user profile adjustments
    const incomeGrowth = userProfile.incomeGrowthRate || 0
    const expenseReduction = userProfile.expenseReductionRate || 0
    
    return projectedCapacity * (1 + incomeGrowth - expenseReduction)
  }

  calculateGoalProbability(goal, monthlySavings, monthsRequired) {
    const timeRemaining = this.calculateTimeRemaining(goal.deadline)
    
    if (timeRemaining <= 0) return 0
    if (monthsRequired <= timeRemaining) return 1
    
    // Probability decreases as required time exceeds available time
    return Math.max(0, timeRemaining / monthsRequired)
  }

  calculateTimeRemaining(deadline) {
    if (!deadline) return Infinity
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - now
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)) // Months
  }

  generateTimelineRecommendations(goal, monthlySavings, monthsRequired) {
    const recommendations = []
    const timeRemaining = this.calculateTimeRemaining(goal.deadline)
    
    if (monthsRequired > timeRemaining) {
      const shortfall = monthsRequired - timeRemaining
      recommendations.push({
        type: 'timeline_adjustment',
        priority: 'high',
        title: 'Extend Timeline or Increase Savings',
        description: `You need ${shortfall} more months to reach your goal`,
        action: 'Consider extending deadline or increasing monthly contributions'
      })
    }
    
    if (monthlySavings < goal.target_amount * 0.1) {
      recommendations.push({
        type: 'savings_optimization',
        priority: 'medium',
        title: 'Optimize Savings Strategy',
        description: 'Consider ways to increase your monthly savings capacity',
        action: 'Review expenses and explore income growth opportunities'
      })
    }
    
    return recommendations
  }

  calculateIncomeStability(incomeHistory) {
    if (incomeHistory.length < 3) return 1
    
    const volatility = this.calculateVolatility(incomeHistory)
    return Math.max(0, 1 - volatility)
  }

  calculateRequiredSavings(goals) {
    return goals.reduce((total, goal) => {
      const timeRemaining = this.calculateTimeRemaining(goal.deadline)
      const remainingAmount = goal.target_amount - (goal.current_amount || 0)
      return total + (remainingAmount / Math.max(timeRemaining, 1))
    }, 0)
  }

  calculateOverallRisk(risks) {
    if (risks.length === 0) return 0
    
    const weightedSum = risks.reduce((sum, risk) => {
      const weight = risk.severity === 'high' ? 3 : risk.severity === 'medium' ? 2 : 1
      return sum + (risk.score * weight)
    }, 0)
    
    const totalWeight = risks.reduce((sum, risk) => {
      return sum + (risk.severity === 'high' ? 3 : risk.severity === 'medium' ? 2 : 1)
    }, 0)
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  generateRiskMitigationRecommendations(risks) {
    const recommendations = []
    
    risks.forEach(risk => {
      if (risk.severity === 'high') {
        recommendations.push({
          type: risk.type,
          priority: 'high',
          title: `Address ${risk.type.replace('_', ' ')}`,
          description: risk.description,
          action: risk.mitigation
        })
      }
    })
    
    return recommendations
  }

  // Solve normal equations for polynomial regression (simplified)
  solveNormalEquations(matrix, y) {
    // Simplified implementation - in production, use a proper matrix library
    const n = matrix.length
    const degree = matrix[0].length - 1
    
    // For simplicity, return coefficients for quadratic regression
    if (degree === 2) {
      return [1, 0, 0] // Placeholder - implement proper matrix solving
    }
    
    return new Array(degree + 1).fill(0)
  }
}

export default new RegressionService()
