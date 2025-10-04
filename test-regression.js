// Test script for regression service
import { ApiService } from './src/services/apiService.js'

async function testRegressionService() {
  console.log('🧪 Testing Regression Service...\n')
  
  try {
    // Test 1: Spending trend prediction
    console.log('📊 Testing spending trend prediction...')
    const testTransactions = [
      { transaction_date: '2024-01-01', amount: -500, transaction_type: 'expense' },
      { transaction_date: '2024-01-15', amount: -300, transaction_type: 'expense' },
      { transaction_date: '2024-02-01', amount: -450, transaction_type: 'expense' },
      { transaction_date: '2024-02-15', amount: -350, transaction_type: 'expense' },
      { transaction_date: '2024-03-01', amount: -400, transaction_type: 'expense' },
      { transaction_date: '2024-03-15', amount: -380, transaction_type: 'expense' }
    ]
    
    const spendingResult = await ApiService.getSpendingTrendPrediction(testTransactions, 6)
    if (spendingResult.success) {
      console.log('✅ Spending trend prediction:', spendingResult.prediction)
    } else {
      console.log('❌ Failed to predict spending trend:', spendingResult.error)
    }
    
    // Test 2: Income growth prediction
    console.log('\n💰 Testing income growth prediction...')
    const testIncomeHistory = [3000, 3100, 3200, 3300, 3400, 3500]
    
    const incomeResult = await ApiService.getIncomeGrowthPrediction(testIncomeHistory, 12)
    if (incomeResult.success) {
      console.log('✅ Income growth prediction:', incomeResult.prediction)
    } else {
      console.log('❌ Failed to predict income growth:', incomeResult.error)
    }
    
    // Test 3: Savings capacity prediction
    console.log('\n💎 Testing savings capacity prediction...')
    const testExpenseHistory = [2500, 2600, 2550, 2700, 2650, 2800]
    
    const savingsResult = await ApiService.getSavingsCapacityPrediction(testIncomeHistory, testExpenseHistory, 12)
    if (savingsResult.success) {
      console.log('✅ Savings capacity prediction:', savingsResult.prediction)
    } else {
      console.log('❌ Failed to predict savings capacity:', savingsResult.error)
    }
    
    // Test 4: Goal timeline prediction
    console.log('\n🎯 Testing goal timeline prediction...')
    const testGoal = {
      id: 1,
      name: 'Emergency Fund',
      target_amount: 10000,
      current_amount: 2000,
      deadline: '2025-12-31'
    }
    
    const testUserProfile = {
      monthlySavingsCapacity: 500,
      incomeGrowthRate: 0.05,
      expenseReductionRate: 0.02,
      riskTolerance: 'medium'
    }
    
    const testHistoricalData = {
      incomeHistory: testIncomeHistory,
      expenseHistory: testExpenseHistory,
      transactions: testTransactions
    }
    
    const goalResult = await ApiService.getGoalTimelinePrediction(testGoal, testUserProfile, testHistoricalData)
    if (goalResult.success) {
      console.log('✅ Goal timeline prediction:', goalResult.prediction)
    } else {
      console.log('❌ Failed to predict goal timeline:', goalResult.error)
    }
    
    // Test 5: Risk assessment
    console.log('\n⚠️ Testing risk assessment...')
    const testGoals = [testGoal]
    const testMarketConditions = {
      volatility: 0.15,
      bullish: true,
      interestRate: 0.05
    }
    
    const riskResult = await ApiService.getFinancialRiskAssessment(testUserProfile, testGoals, testMarketConditions)
    if (riskResult.success) {
      console.log('✅ Risk assessment:', riskResult.assessment)
    } else {
      console.log('❌ Failed to assess risk:', riskResult.error)
    }
    
    // Test 6: Comprehensive insights
    console.log('\n🔍 Testing comprehensive insights...')
    const comprehensiveResult = await ApiService.getComprehensiveFinancialInsights(
      testTransactions,
      testIncomeHistory,
      testExpenseHistory,
      testGoals,
      testUserProfile,
      testMarketConditions
    )
    
    if (comprehensiveResult.success) {
      console.log('✅ Comprehensive insights generated successfully')
      console.log('   - Spending trend:', comprehensiveResult.insights.spendingTrend?.trend || 'N/A')
      console.log('   - Income growth:', comprehensiveResult.insights.incomeGrowth?.trend || 'N/A')
      console.log('   - Savings capacity:', comprehensiveResult.insights.savingsCapacity?.currentCapacity || 'N/A')
      console.log('   - Risk score:', Math.round((comprehensiveResult.insights.riskAssessment?.overallRisk || 0) * 100) + '%')
      console.log('   - Goal predictions:', comprehensiveResult.insights.goalPredictions?.length || 0)
    } else {
      console.log('❌ Failed to generate comprehensive insights:', comprehensiveResult.error)
    }
    
    console.log('\n🎉 Regression Service testing completed!')
    
  } catch (error) {
    console.error('❌ Error testing regression service:', error)
  }
}

// Run the test
testRegressionService()
