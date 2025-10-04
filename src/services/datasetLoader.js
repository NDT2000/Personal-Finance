// Dataset Loader for Kaggle and other financial datasets
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

class DatasetLoader {
  constructor() {
    this.datasets = new Map()
    this.processedData = new Map()
  }

  // Load CSV dataset from file
  async loadCSVDataset(filePath, options = {}) {
    try {
      const {
        delimiter = ',',
        skipEmptyLines = true,
        encoding = 'utf8'
      } = options

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      const data = []
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath, { encoding })
          .pipe(csv({ 
            separator: delimiter,
            skipEmptyLines 
          }))
          .on('data', (row) => {
            // Clean and process each row
            const cleanedRow = this.cleanRow(row)
            if (cleanedRow) {
              data.push(cleanedRow)
            }
          })
          .on('end', () => {
            console.log(`✅ Loaded ${data.length} records from ${filePath}`)
            resolve(data)
          })
          .on('error', (error) => {
            console.error('❌ Error loading CSV:', error)
            reject(error)
          })
      })
    } catch (error) {
      console.error('Error loading CSV dataset:', error)
      throw error
    }
  }

  // Clean and validate data row
  cleanRow(row) {
    const cleanedRow = {}
    
    for (const [key, value] of Object.entries(row)) {
      // Remove extra whitespace
      const cleanKey = key.trim()
      const cleanValue = value ? value.toString().trim() : ''
      
      // Skip empty values
      if (cleanValue === '' || cleanValue === 'null' || cleanValue === 'undefined') {
        continue
      }
      
      // Convert numeric values
      if (this.isNumeric(cleanValue)) {
        cleanedRow[cleanKey] = parseFloat(cleanValue)
      } else {
        cleanedRow[cleanKey] = cleanValue
      }
    }
    
    // Only return rows with essential data
    return Object.keys(cleanedRow).length > 0 ? cleanedRow : null
  }

  // Check if value is numeric
  isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value)
  }

  // Load sample Kaggle-style financial dataset
  async loadSampleFinancialDataset() {
    const sampleData = [
      {
        user_id: 1,
        age: 28,
        income: 50000,
        monthly_expenses: 3500,
        savings_rate: 0.15,
        debt_amount: 15000,
        credit_score: 720,
        spending_category: 'moderate',
        financial_goals: 'house_purchase',
        risk_tolerance: 'medium'
      },
      {
        user_id: 2,
        age: 35,
        income: 75000,
        monthly_expenses: 4500,
        savings_rate: 0.25,
        debt_amount: 25000,
        credit_score: 680,
        spending_category: 'conservative',
        financial_goals: 'retirement',
        risk_tolerance: 'low'
      },
      {
        user_id: 3,
        age: 42,
        income: 90000,
        monthly_expenses: 6000,
        savings_rate: 0.20,
        debt_amount: 40000,
        credit_score: 750,
        spending_category: 'aggressive',
        financial_goals: 'investment',
        risk_tolerance: 'high'
      },
      {
        user_id: 4,
        age: 31,
        income: 60000,
        monthly_expenses: 4200,
        savings_rate: 0.18,
        debt_amount: 20000,
        credit_score: 700,
        spending_category: 'moderate',
        financial_goals: 'education',
        risk_tolerance: 'medium'
      },
      {
        user_id: 5,
        age: 26,
        income: 45000,
        monthly_expenses: 3200,
        savings_rate: 0.12,
        debt_amount: 12000,
        credit_score: 650,
        spending_category: 'conservative',
        financial_goals: 'emergency_fund',
        risk_tolerance: 'low'
      }
    ]

    console.log(`✅ Loaded ${sampleData.length} sample financial records`)
    return sampleData
  }

  // Process financial dataset for training
  processFinancialDataset(rawData) {
    const processedData = {
      features: [],
      targets: {
        savings_capacity: [],
        spending_trend: [],
        risk_score: [],
        goal_achievement: []
      },
      metadata: {
        totalRecords: rawData.length,
        features: [],
        targetColumns: []
      }
    }

    rawData.forEach((record, index) => {
      // Extract features
      const features = {
        age: record.age || 0,
        income: record.income || 0,
        monthly_expenses: record.monthly_expenses || 0,
        debt_amount: record.debt_amount || 0,
        credit_score: record.credit_score || 0,
        savings_rate: record.savings_rate || 0,
        spending_category_encoded: this.encodeSpendingCategory(record.spending_category),
        risk_tolerance_encoded: this.encodeRiskTolerance(record.risk_tolerance),
        financial_goals_encoded: this.encodeFinancialGoals(record.financial_goals)
      }

      // Calculate targets
      const savingsCapacity = (record.income || 0) - (record.monthly_expenses || 0)
      const spendingTrend = this.calculateSpendingTrend(record)
      const riskScore = this.calculateRiskScore(record)
      const goalAchievement = this.calculateGoalAchievement(record)

      processedData.features.push(features)
      processedData.targets.savings_capacity.push(savingsCapacity)
      processedData.targets.spending_trend.push(spendingTrend)
      processedData.targets.risk_score.push(riskScore)
      processedData.targets.goal_achievement.push(goalAchievement)
    })

    // Update metadata
    processedData.metadata.features = Object.keys(processedData.features[0] || {})
    processedData.metadata.targetColumns = Object.keys(processedData.targets)

    console.log(`✅ Processed ${processedData.features.length} records for training`)
    return processedData
  }

  // Encode categorical variables
  encodeSpendingCategory(category) {
    const encoding = {
      'conservative': 0,
      'moderate': 1,
      'aggressive': 2
    }
    return encoding[category] || 1
  }

  encodeRiskTolerance(tolerance) {
    const encoding = {
      'low': 0,
      'medium': 1,
      'high': 2
    }
    return encoding[tolerance] || 1
  }

  encodeFinancialGoals(goals) {
    const encoding = {
      'emergency_fund': 0,
      'house_purchase': 1,
      'education': 2,
      'retirement': 3,
      'investment': 4
    }
    return encoding[goals] || 0
  }

  // Calculate derived targets
  calculateSpendingTrend(record) {
    const income = record.income || 0
    const expenses = record.monthly_expenses || 0
    
    if (income === 0) return 0
    
    // Spending trend: negative means spending more relative to income
    return (expenses / income) - 0.5 // 0.5 is baseline
  }

  calculateRiskScore(record) {
    const age = record.age || 0
    const debt = record.debt_amount || 0
    const income = record.income || 0
    const creditScore = record.credit_score || 0
    
    // Risk factors
    const debtToIncomeRatio = income > 0 ? debt / income : 1
    const creditRisk = creditScore < 600 ? 1 : creditScore < 700 ? 0.5 : 0
    const ageRisk = age < 25 ? 0.3 : age > 60 ? 0.2 : 0
    
    // Combined risk score (0-1, higher is riskier)
    return Math.min(1, debtToIncomeRatio * 0.4 + creditRisk * 0.4 + ageRisk * 0.2)
  }

  calculateGoalAchievement(record) {
    const savingsRate = record.savings_rate || 0
    const income = record.income || 0
    const expenses = record.monthly_expenses || 0
    
    // Goal achievement probability based on savings capacity
    const monthlySavings = (income / 12) - expenses
    const requiredSavings = income * 0.2 // 20% savings rate target
    
    return monthlySavings >= requiredSavings ? 1 : monthlySavings / requiredSavings
  }

  // Split dataset for training and testing
  splitDataset(processedData, testRatio = 0.2) {
    const totalRecords = processedData.features.length
    const testSize = Math.floor(totalRecords * testRatio)
    const trainSize = totalRecords - testSize
    
    // Shuffle indices
    const indices = Array.from({ length: totalRecords }, (_, i) => i)
    this.shuffleArray(indices)
    
    // Split data
    const trainIndices = indices.slice(0, trainSize)
    const testIndices = indices.slice(trainSize)
    
    const trainData = {
      features: trainIndices.map(i => processedData.features[i]),
      targets: {
        savings_capacity: trainIndices.map(i => processedData.targets.savings_capacity[i]),
        spending_trend: trainIndices.map(i => processedData.targets.spending_trend[i]),
        risk_score: trainIndices.map(i => processedData.targets.risk_score[i]),
        goal_achievement: trainIndices.map(i => processedData.targets.goal_achievement[i])
      }
    }
    
    const testData = {
      features: testIndices.map(i => processedData.features[i]),
      targets: {
        savings_capacity: testIndices.map(i => processedData.targets.savings_capacity[i]),
        spending_trend: testIndices.map(i => processedData.targets.spending_trend[i]),
        risk_score: testIndices.map(i => processedData.targets.risk_score[i]),
        goal_achievement: testIndices.map(i => processedData.targets.goal_achievement[i])
      }
    }
    
    return { trainData, testData }
  }

  // Shuffle array in place
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Load and process dataset from file
  async loadAndProcessDataset(filePath, options = {}) {
    try {
      console.log(`📊 Loading dataset from: ${filePath}`)
      
      // Load raw data
      const rawData = await this.loadCSVDataset(filePath, options)
      
      // Process for training
      const processedData = this.processFinancialDataset(rawData)
      
      // Split for training/testing
      const { trainData, testData } = this.splitDataset(processedData, options.testRatio || 0.2)
      
      return {
        rawData,
        processedData,
        trainData,
        testData,
        metadata: processedData.metadata
      }
    } catch (error) {
      console.error('Error loading and processing dataset:', error)
      throw error
    }
  }

  // Get dataset statistics
  getDatasetStats(dataset) {
    const stats = {
      totalRecords: dataset.features.length,
      featureCount: dataset.features[0] ? Object.keys(dataset.features[0]).length : 0,
      targetCount: Object.keys(dataset.targets).length,
      featureStats: {},
      targetStats: {}
    }

    // Calculate feature statistics
    if (dataset.features.length > 0) {
      const featureNames = Object.keys(dataset.features[0])
      featureNames.forEach(feature => {
        const values = dataset.features.map(record => record[feature]).filter(v => !isNaN(v))
        if (values.length > 0) {
          stats.featureStats[feature] = {
            min: Math.min(...values),
            max: Math.max(...values),
            mean: values.reduce((sum, val) => sum + val, 0) / values.length,
            count: values.length
          }
        }
      })
    }

    // Calculate target statistics
    Object.keys(dataset.targets).forEach(target => {
      const values = dataset.targets[target].filter(v => !isNaN(v))
      if (values.length > 0) {
        stats.targetStats[target] = {
          min: Math.min(...values),
          max: Math.max(...values),
          mean: values.reduce((sum, val) => sum + val, 0) / values.length,
          count: values.length
        }
      }
    })

    return stats
  }
}

export default new DatasetLoader()
