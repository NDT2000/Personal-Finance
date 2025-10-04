// Predictive Analytics Engine for Financial Goals
class PredictiveAnalytics {
  constructor() {
    this.analysisCache = new Map()
    this.patternCache = new Map()
  }

  // Analyze spending patterns to predict future expenses
  analyzeSpendingPatterns(transactions, months = 6) {
    const recentTransactions = this.getRecentTransactions(transactions, months)
    const patterns = {
      monthlyAverage: this.calculateMonthlyAverage(recentTransactions),
      seasonalTrends: this.identifySeasonalTrends(recentTransactions),
      categoryPatterns: this.analyzeCategoryPatterns(recentTransactions),
      spendingVelocity: this.calculateSpendingVelocity(recentTransactions),
      volatility: this.calculateSpendingVolatility(recentTransactions)
    }
    
    return patterns
  }

  // Predict future savings capacity based on income and spending patterns
  predictSavingsCapacity(incomeHistory, expenseHistory, months = 12) {
    const avgMonthlyIncome = this.calculateAverage(incomeHistory)
    const avgMonthlyExpenses = this.calculateAverage(expenseHistory)
    const spendingTrend = this.calculateTrend(expenseHistory)
    const incomeTrend = this.calculateTrend(incomeHistory)
    
    // Predict future capacity
    const projectedIncome = avgMonthlyIncome * (1 + incomeTrend)
    const projectedExpenses = avgMonthlyExpenses * (1 + spendingTrend)
    const projectedSavings = projectedIncome - projectedExpenses
    
    return {
      currentCapacity: avgMonthlyIncome - avgMonthlyExpenses,
      projectedCapacity: projectedSavings,
      incomeTrend,
      expenseTrend: spendingTrend,
      confidence: this.calculateConfidence(incomeHistory, expenseHistory)
    }
  }

  // Calculate goal achievement probability
  calculateGoalProbability(goal, userProfile, marketConditions = {}) {
    const timeRemaining = this.calculateTimeRemaining(goal.deadline)
    const currentProgress = goal.current_amount / goal.target_amount
    const requiredMonthlyContribution = this.calculateRequiredMonthlyContribution(goal, timeRemaining)
    const availableCapacity = userProfile.monthlySavingsCapacity || 0
    
    // Base probability calculation
    let baseProbability = 0.5
    
    // Adjust based on current progress
    if (currentProgress > 0.5) baseProbability += 0.2
    if (currentProgress > 0.75) baseProbability += 0.2
    
    // Adjust based on capacity vs requirement
    const capacityRatio = availableCapacity / requiredMonthlyContribution
    if (capacityRatio >= 1.2) baseProbability += 0.2
    else if (capacityRatio >= 1.0) baseProbability += 0.1
    else if (capacityRatio < 0.8) baseProbability -= 0.3
    else if (capacityRatio < 0.6) baseProbability -= 0.5
    
    // Adjust based on time remaining
    if (timeRemaining > 12) baseProbability += 0.1
    else if (timeRemaining < 3) baseProbability -= 0.3
    
    // Adjust based on goal type and market conditions
    if (goal.goal_type === 'investment' && marketConditions.bullish) baseProbability += 0.1
    if (goal.goal_type === 'investment' && marketConditions.bearish) baseProbability -= 0.1
    
    return Math.max(0, Math.min(1, baseProbability))
  }

  // Generate smart recommendations
  generateRecommendations(goal, userProfile, spendingPatterns) {
    const recommendations = []
    const probability = this.calculateGoalProbability(goal, userProfile)
    const requiredMonthly = this.calculateRequiredMonthlyContribution(goal, this.calculateTimeRemaining(goal.deadline))
    const currentCapacity = userProfile.monthlySavingsCapacity || 0
    
    // Budget optimization recommendations
    if (currentCapacity < requiredMonthly) {
      const shortfall = requiredMonthly - currentCapacity
      recommendations.push({
        type: 'budget_optimization',
        priority: 'high',
        title: 'Increase Monthly Savings',
        description: 'You need to save $' + shortfall.toFixed(2) + ' more per month to reach your goal',
        action: 'Reduce expenses or increase income',
        impact: 'high',
        effort: 'medium'
      })
    }
    
    // Timeline adjustment recommendations
    if (probability < 0.3 && goal.deadline) {
      const suggestedDeadline = this.calculateOptimalDeadline(goal, currentCapacity)
      recommendations.push({
        type: 'timeline_adjustment',
        priority: 'medium',
        title: 'Consider Extending Deadline',
        description: 'Extending your deadline to ' + suggestedDeadline + ' would increase your success probability',
        action: 'Adjust goal deadline',
        impact: 'high',
        effort: 'low'
      })
    }
    
    // Income optimization recommendations
    if (userProfile.incomeTrend < 0.02) { // Less than 2% growth
      recommendations.push({
        type: 'income_optimization',
        priority: 'medium',
        title: 'Explore Income Growth',
        description: 'Consider ways to increase your income to accelerate goal achievement',
        action: 'Look for salary increases, side hustles, or investments',
        impact: 'high',
        effort: 'high'
      })
    }
    
    // Spending optimization recommendations
    const topSpendingCategories = this.getTopSpendingCategories(spendingPatterns)
    if (topSpendingCategories.length > 0) {
      recommendations.push({
        type: 'spending_optimization',
        priority: 'medium',
        title: 'Optimize High-Spending Categories',
        description: 'Consider reducing spending in: ' + topSpendingCategories.join(', '),
        action: 'Review and reduce expenses in these categories',
        impact: 'medium',
        effort: 'medium'
      })
    }
    
    return recommendations
  }

  // Calculate risk factors for goal achievement
  assessRisks(goal, userProfile, marketConditions = {}) {
    const risks = []
    
    // Time risk
    const timeRemaining = this.calculateTimeRemaining(goal.deadline)
    if (timeRemaining < 6) {
      risks.push({
        type: 'time_risk',
        severity: 'high',
        description: 'Limited time remaining to achieve goal',
        mitigation: 'Consider extending deadline or increasing contributions'
      })
    }
    
    // Capacity risk
    const requiredMonthly = this.calculateRequiredMonthlyContribution(goal, timeRemaining)
    const currentCapacity = userProfile.monthlySavingsCapacity || 0
    if (currentCapacity < requiredMonthly * 0.8) {
      risks.push({
        type: 'capacity_risk',
        severity: 'high',
        description: 'Insufficient monthly savings capacity',
        mitigation: 'Increase income or reduce expenses'
      })
    }
    
    // Market risk (for investment goals)
    if (goal.goal_type === 'investment') {
      if (marketConditions.volatility > 0.2) {
        risks.push({
          type: 'market_risk',
          severity: 'medium',
          description: 'High market volatility may affect investment returns',
          mitigation: 'Consider more conservative investment strategies'
        })
      }
    }
    
    // Progress risk
    const currentProgress = goal.current_amount / goal.target_amount
    const expectedProgress = this.calculateExpectedProgress(goal)
    if (currentProgress < expectedProgress * 0.8) {
      risks.push({
        type: 'progress_risk',
        severity: 'medium',
        description: 'Behind expected progress',
        mitigation: 'Increase contributions or adjust timeline'
      })
    }
    
    return risks
  }

  // Helper methods
  getRecentTransactions(transactions, months) {
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - months)
    return transactions.filter(t => new Date(t.transaction_date) >= cutoffDate)
  }

  calculateMonthlyAverage(transactions) {
    const monthlyTotals = this.groupByMonth(transactions)
    const amounts = Object.values(monthlyTotals)
    return amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length
  }

  identifySeasonalTrends(transactions) {
    const monthlyData = this.groupByMonth(transactions)
    const months = Object.keys(monthlyData).sort()
    const amounts = months.map(month => monthlyData[month])
    
    // Simple trend analysis
    let trend = 0
    for (let i = 1; i < amounts.length; i++) {
      trend += (amounts[i] - amounts[i-1]) / amounts[i-1]
    }
    
    return {
      direction: trend > 0 ? 'increasing' : 'decreasing',
      strength: Math.abs(trend) / amounts.length,
      seasonal: this.detectSeasonality(amounts)
    }
  }

  analyzeCategoryPatterns(transactions) {
    const categoryTotals = {}
    transactions.forEach(t => {
      if (t.transaction_type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount)
      }
    })
    return categoryTotals
  }

  calculateSpendingVelocity(transactions) {
    const recent = transactions.slice(0, 30) // Last 30 transactions
    const total = recent.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    return total / 30 // Average per transaction
  }

  calculateSpendingVolatility(transactions) {
    const monthlyData = this.groupByMonth(transactions)
    const amounts = Object.values(monthlyData)
    if (amounts.length < 2) return 0
    
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length
    return Math.sqrt(variance) / mean // Coefficient of variation
  }

  calculateAverage(data) {
    if (data.length === 0) return 0
    return data.reduce((sum, item) => sum + item, 0) / data.length
  }

  calculateTrend(data) {
    if (data.length < 2) return 0
    const first = data[0]
    const last = data[data.length - 1]
    return (last - first) / first
  }

  calculateConfidence(incomeHistory, expenseHistory) {
    // Higher confidence with more data points and lower volatility
    const incomeVolatility = this.calculateVolatility(incomeHistory)
    const expenseVolatility = this.calculateVolatility(expenseHistory)
    const dataPoints = Math.min(incomeHistory.length, expenseHistory.length)
    
    const volatilityScore = 1 - (incomeVolatility + expenseVolatility) / 2
    const dataScore = Math.min(dataPoints / 12, 1) // Normalize to 12 months
    
    return (volatilityScore + dataScore) / 2
  }

  calculateVolatility(data) {
    if (data.length < 2) return 0
    const mean = this.calculateAverage(data)
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length
    return Math.sqrt(variance) / mean
  }

  calculateTimeRemaining(deadline) {
    if (!deadline) return Infinity
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - now
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)) // Months remaining
  }

  calculateRequiredMonthlyContribution(goal, timeRemaining) {
    if (timeRemaining <= 0) return 0
    const remainingAmount = goal.target_amount - goal.current_amount
    return remainingAmount / timeRemaining
  }

  calculateOptimalDeadline(goal, monthlyCapacity) {
    const remainingAmount = goal.target_amount - goal.current_amount
    const monthsNeeded = Math.ceil(remainingAmount / monthlyCapacity)
    const optimalDate = new Date()
    optimalDate.setMonth(optimalDate.getMonth() + monthsNeeded)
    return optimalDate.toISOString().split('T')[0]
  }

  getTopSpendingCategories(spendingPatterns) {
    return Object.entries(spendingPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)
  }

  calculateExpectedProgress(goal) {
    if (!goal.deadline) return 0
    const totalTime = this.calculateTimeRemaining(goal.deadline) + this.calculateElapsedTime(goal)
    const elapsedTime = this.calculateElapsedTime(goal)
    return elapsedTime / totalTime
  }

  calculateElapsedTime(goal) {
    const createdDate = new Date(goal.created_at)
    const now = new Date()
    const diffTime = now - createdDate
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)) // Months elapsed
  }

  groupByMonth(transactions) {
    const monthlyData = {}
    transactions.forEach(t => {
      const date = new Date(t.transaction_date)
      const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Math.abs(t.amount)
    })
    return monthlyData
  }

  detectSeasonality(amounts) {
    if (amounts.length < 12) return false
    // Simple seasonality detection - look for patterns in monthly data
    const recent = amounts.slice(-12)
    const firstHalf = recent.slice(0, 6)
    const secondHalf = recent.slice(6)
    
    const firstAvg = this.calculateAverage(firstHalf)
    const secondAvg = this.calculateAverage(secondHalf)
    
    return Math.abs(firstAvg - secondAvg) / firstAvg > 0.2 // 20% difference indicates seasonality
  }
}

export default new PredictiveAnalytics()
