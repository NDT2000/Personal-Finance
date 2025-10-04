// Model Training Service for Kaggle Dataset Integration
import regressionService from './regressionService.js'
import datasetLoader from './datasetLoader.js'

class ModelTrainer {
  constructor() {
    this.trainedModels = new Map()
    this.trainingHistory = []
    this.modelMetrics = new Map()
  }

  // Train regression models on financial dataset
  async trainFinancialModels(dataset, options = {}) {
    try {
      console.log('🚀 Starting model training...')
      
      const {
        testRatio = 0.2,
        validationRatio = 0.1,
        targetColumns = ['savings_capacity', 'spending_trend', 'risk_score', 'goal_achievement'],
        algorithms = ['linear', 'polynomial', 'exponential']
      } = options

      const results = {
        trainingData: dataset.trainData,
        testData: dataset.testData,
        models: {},
        metrics: {},
        recommendations: []
      }

      // Train models for each target
      for (const target of targetColumns) {
        console.log(`📊 Training model for target: ${target}`)
        
        const modelResult = await this.trainTargetModel(
          dataset.trainData,
          dataset.testData,
          target,
          algorithms
        )
        
        results.models[target] = modelResult.model
        results.metrics[target] = modelResult.metrics
        
        // Store trained model
        this.trainedModels.set(`${target}_model`, modelResult.model)
        this.modelMetrics.set(`${target}_metrics`, modelResult.metrics)
      }

      // Generate training recommendations
      results.recommendations = this.generateTrainingRecommendations(results.metrics)
      
      // Store training history
      this.trainingHistory.push({
        timestamp: new Date().toISOString(),
        datasetSize: dataset.trainData.features.length,
        targets: targetColumns,
        algorithms: algorithms,
        overallAccuracy: this.calculateOverallAccuracy(results.metrics)
      })

      console.log('✅ Model training completed successfully')
      return results
      
    } catch (error) {
      console.error('❌ Error training models:', error)
      throw error
    }
  }

  // Train model for specific target
  async trainTargetModel(trainData, testData, target, algorithms) {
    const targetValues = trainData.targets[target]
    const testTargetValues = testData.targets[target]
    
    if (!targetValues || targetValues.length === 0) {
      throw new Error(`No target values found for ${target}`)
    }

    const features = trainData.features
    const testFeatures = testData.features
    
    // Prepare feature matrix
    const featureMatrix = this.prepareFeatureMatrix(features)
    const testFeatureMatrix = this.prepareFeatureMatrix(testFeatures)
    
    const bestModel = {
      algorithm: null,
      model: null,
      accuracy: 0,
      rSquared: 0,
      predictions: [],
      actual: testTargetValues
    }

    // Try different algorithms
    for (const algorithm of algorithms) {
      try {
        const modelResult = await this.trainAlgorithm(
          featureMatrix,
          targetValues,
          testFeatureMatrix,
          testTargetValues,
          algorithm
        )
        
        if (modelResult.rSquared > bestModel.rSquared) {
          bestModel.algorithm = algorithm
          bestModel.model = modelResult.model
          bestModel.accuracy = modelResult.accuracy
          bestModel.rSquared = modelResult.rSquared
          bestModel.predictions = modelResult.predictions
        }
      } catch (error) {
        console.warn(`⚠️ Algorithm ${algorithm} failed for ${target}:`, error.message)
      }
    }

    const metrics = {
      algorithm: bestModel.algorithm,
      rSquared: bestModel.rSquared,
      accuracy: bestModel.accuracy,
      mse: this.calculateMSE(testTargetValues, bestModel.predictions),
      mae: this.calculateMAE(testTargetValues, bestModel.predictions),
      predictions: bestModel.predictions,
      actual: testTargetValues
    }

    return {
      model: bestModel.model,
      metrics: metrics
    }
  }

  // Train specific algorithm
  async trainAlgorithm(features, targets, testFeatures, testTargets, algorithm) {
    let model, predictions

    try {
      switch (algorithm) {
        case 'linear':
          model = this.trainLinearRegression(features, targets)
          predictions = testFeatures.map(x => {
            try {
              return model.predict(x[0] || 0)
            } catch (error) {
              console.warn('Linear prediction error:', error)
              return targets.reduce((sum, val) => sum + val, 0) / targets.length
            }
          })
          break
          
        case 'polynomial':
          model = this.trainPolynomialRegression(features, targets, 2)
          predictions = testFeatures.map(x => {
            try {
              return model.predict(x[0] || 0)
            } catch (error) {
              console.warn('Polynomial prediction error:', error)
              return targets.reduce((sum, val) => sum + val, 0) / targets.length
            }
          })
          break
          
        case 'exponential':
          model = this.trainExponentialRegression(features, targets)
          predictions = testFeatures.map(x => {
            try {
              return model.predict(x[0] || 0)
            } catch (error) {
              console.warn('Exponential prediction error:', error)
              return targets.reduce((sum, val) => sum + val, 0) / targets.length
            }
          })
          break
          
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`)
      }

      // Ensure predictions array matches testTargets length
      if (predictions.length !== testTargets.length) {
        console.warn(`Prediction length mismatch: ${predictions.length} vs ${testTargets.length}`)
        // Generate predictions for all test features
        predictions = testFeatures.map(x => {
          try {
            return model.predict(x[0] || 0)
          } catch (error) {
            console.warn('Prediction error:', error)
            return 0
          }
        })
      }

      const rSquared = this.calculateRSquared(testTargets, predictions)
      const accuracy = this.calculateAccuracy(testTargets, predictions)

      return {
        model,
        rSquared,
        accuracy,
        predictions
      }
    } catch (error) {
      console.error(`Error training ${algorithm}:`, error)
      throw error
    }
  }

  // Prepare feature matrix from dataset
  prepareFeatureMatrix(features) {
    if (!features || features.length === 0) {
      throw new Error('No features provided')
    }

    const featureNames = Object.keys(features[0])
    return features.map(record => 
      featureNames.map(name => record[name] || 0)
    )
  }

  // Train linear regression model
  trainLinearRegression(features, targets) {
    if (features.length !== targets.length) {
      throw new Error('Features and targets length mismatch')
    }

    // Convert to 1D for simple linear regression
    const x = features.map(f => f[0] || 0) // Use first feature for simplicity
    const y = targets

    try {
      return regressionService.linearRegression(x, y)
    } catch (error) {
      console.error('Linear regression training error:', error)
      // Return a simple fallback model
      return {
        slope: 0,
        intercept: y.reduce((sum, val) => sum + val, 0) / y.length,
        rSquared: 0,
        predict: (xValue) => y.reduce((sum, val) => sum + val, 0) / y.length
      }
    }
  }

  // Train polynomial regression model
  trainPolynomialRegression(features, targets, degree = 2) {
    if (features.length !== targets.length) {
      throw new Error('Features and targets length mismatch')
    }

    const x = features.map(f => f[0] || 0)
    const y = targets

    try {
      return regressionService.polynomialRegression(x, y, degree)
    } catch (error) {
      console.error('Polynomial regression training error:', error)
      // Return a simple fallback model
      return {
        coefficients: [0, 0, 0],
        degree: 2,
        predict: (xValue) => y.reduce((sum, val) => sum + val, 0) / y.length
      }
    }
  }

  // Train exponential regression model
  trainExponentialRegression(features, targets) {
    if (features.length !== targets.length) {
      throw new Error('Features and targets length mismatch')
    }

    const x = features.map(f => f[0] || 0)
    const y = targets.map(t => Math.max(t, 0.001)) // Ensure positive values

    try {
      return regressionService.exponentialRegression(x, y)
    } catch (error) {
      console.error('Exponential regression training error:', error)
      // Return a simple fallback model
      return {
        a: y.reduce((sum, val) => sum + val, 0) / y.length,
        b: 0,
        rSquared: 0,
        predict: (xValue) => y.reduce((sum, val) => sum + val, 0) / y.length
      }
    }
  }

  // Calculate R-squared
  calculateRSquared(actual, predicted) {
    if (actual.length !== predicted.length) {
      throw new Error('Actual and predicted length mismatch')
    }

    const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length
    const ssRes = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0)
    const ssTot = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0)
    
    return ssTot === 0 ? 0 : 1 - (ssRes / ssTot)
  }

  // Calculate accuracy (for classification-like tasks)
  calculateAccuracy(actual, predicted) {
    if (actual.length !== predicted.length) {
      throw new Error('Actual and predicted length mismatch')
    }

    const tolerance = 0.1 // 10% tolerance
    let correct = 0
    
    for (let i = 0; i < actual.length; i++) {
      const diff = Math.abs(actual[i] - predicted[i])
      const maxVal = Math.max(Math.abs(actual[i]), Math.abs(predicted[i]))
      const relativeError = maxVal > 0 ? diff / maxVal : 0
      
      if (relativeError <= tolerance) {
        correct++
      }
    }
    
    return correct / actual.length
  }

  // Calculate Mean Squared Error
  calculateMSE(actual, predicted) {
    if (actual.length !== predicted.length) {
      console.warn(`MSE calculation: length mismatch - actual: ${actual.length}, predicted: ${predicted.length}`)
      // Use the shorter length to avoid errors
      const minLength = Math.min(actual.length, predicted.length)
      const mse = actual.slice(0, minLength).reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0)
      return mse / minLength
    }

    const mse = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0)
    return mse / actual.length
  }

  // Calculate Mean Absolute Error
  calculateMAE(actual, predicted) {
    if (actual.length !== predicted.length) {
      console.warn(`MAE calculation: length mismatch - actual: ${actual.length}, predicted: ${predicted.length}`)
      // Use the shorter length to avoid errors
      const minLength = Math.min(actual.length, predicted.length)
      const mae = actual.slice(0, minLength).reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0)
      return mae / minLength
    }

    const mae = actual.reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0)
    return mae / actual.length
  }

  // Generate training recommendations
  generateTrainingRecommendations(metrics) {
    const recommendations = []
    
    Object.entries(metrics).forEach(([target, metric]) => {
      if (metric.rSquared < 0.5) {
        recommendations.push({
          type: 'low_accuracy',
          target: target,
          message: `${target} model has low accuracy (R² = ${metric.rSquared.toFixed(3)}). Consider more data or feature engineering.`,
          priority: 'high'
        })
      }
      
      if (metric.mse > 1000) {
        recommendations.push({
          type: 'high_error',
          target: target,
          message: `${target} model has high prediction error (MSE = ${metric.mse.toFixed(2)}). Consider data preprocessing.`,
          priority: 'medium'
        })
      }
      
      if (metric.accuracy > 0.8) {
        recommendations.push({
          type: 'good_performance',
          target: target,
          message: `${target} model shows good performance (Accuracy = ${(metric.accuracy * 100).toFixed(1)}%).`,
          priority: 'low'
        })
      }
    })
    
    return recommendations
  }

  // Calculate overall accuracy across all models
  calculateOverallAccuracy(metrics) {
    const accuracies = Object.values(metrics).map(m => m.accuracy)
    return accuracies.length > 0 ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length : 0
  }

  // Load and train models from Kaggle dataset
  async loadAndTrainFromKaggle(filePath, options = {}) {
    try {
      console.log(`📊 Loading Kaggle dataset from: ${filePath}`)
      
      // Load and process dataset
      const dataset = await datasetLoader.loadAndProcessDataset(filePath, options)
      
      // Train models
      const trainingResults = await this.trainFinancialModels(dataset, options)
      
      return {
        dataset: dataset,
        trainingResults: trainingResults,
        stats: datasetLoader.getDatasetStats(dataset.trainData)
      }
      
    } catch (error) {
      console.error('Error loading and training from Kaggle dataset:', error)
      throw error
    }
  }

  // Train with sample data (for testing)
  async trainWithSampleData() {
    try {
      console.log('📊 Training with sample financial data...')
      
      // Load sample data
      const sampleData = await datasetLoader.loadSampleFinancialDataset()
      
      // Process for training
      const processedData = datasetLoader.processFinancialDataset(sampleData)
      
      // Split dataset
      const { trainData, testData } = datasetLoader.splitDataset(processedData, 0.2)
      
      const dataset = {
        trainData,
        testData,
        metadata: processedData.metadata
      }
      
      // Train models
      const trainingResults = await this.trainFinancialModels(dataset, {
        targetColumns: ['savings_capacity', 'spending_trend', 'risk_score', 'goal_achievement'],
        algorithms: ['linear', 'polynomial', 'exponential']
      })
      
      return {
        dataset: dataset,
        trainingResults: trainingResults,
        stats: datasetLoader.getDatasetStats(trainData)
      }
      
    } catch (error) {
      console.error('Error training with sample data:', error)
      throw error
    }
  }

  // Get trained model
  getTrainedModel(target) {
    return this.trainedModels.get(`${target}_model`)
  }

  // Get model metrics
  getModelMetrics(target) {
    return this.modelMetrics.get(`${target}_metrics`)
  }

  // Get training history
  getTrainingHistory() {
    return this.trainingHistory
  }

  // Clear all models
  clearModels() {
    this.trainedModels.clear()
    this.modelMetrics.clear()
    this.trainingHistory = []
  }

  // Export trained models
  exportModels() {
    const models = {}
    this.trainedModels.forEach((model, key) => {
      models[key] = {
        algorithm: model.algorithm || 'unknown',
        coefficients: model.coefficients || model.slope || null,
        intercept: model.intercept || null,
        rSquared: model.rSquared || 0
      }
    })
    
    return {
      models,
      metrics: Object.fromEntries(this.modelMetrics),
      trainingHistory: this.trainingHistory
    }
  }
}

export default new ModelTrainer()
