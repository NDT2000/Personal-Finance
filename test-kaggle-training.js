// Test script for Kaggle dataset training
import { ApiService } from './src/services/apiService.js'

async function testKaggleTraining() {
  console.log('🧪 Testing Kaggle Dataset Training...\n')
  
  try {
    // Test 1: Train with sample data
    console.log('📊 Testing sample data training...')
    const sampleResult = await ApiService.trainWithSampleData()
    if (sampleResult.success) {
      console.log('✅ Sample training successful')
      console.log(`   - Training records: ${sampleResult.result.dataset.trainData.features.length}`)
      console.log(`   - Test records: ${sampleResult.result.dataset.testData.features.length}`)
      console.log(`   - Features: ${sampleResult.result.dataset.metadata.featureCount}`)
      console.log(`   - Targets: ${sampleResult.result.dataset.metadata.targetCount}`)
      
      // Show model performance
      const metrics = sampleResult.result.trainingResults.metrics
      Object.entries(metrics).forEach(([target, metric]) => {
        console.log(`   - ${target}: R²=${metric.rSquared.toFixed(3)}, Accuracy=${(metric.accuracy * 100).toFixed(1)}%`)
      })
    } else {
      console.log('❌ Sample training failed:', sampleResult.error)
    }
    
    // Test 2: Get training history
    console.log('\n📚 Testing training history...')
    const historyResult = await ApiService.getTrainingHistory()
    if (historyResult.success) {
      console.log('✅ Training history retrieved')
      console.log(`   - History entries: ${historyResult.history.length}`)
      if (historyResult.history.length > 0) {
        const latest = historyResult.history[historyResult.history.length - 1]
        console.log(`   - Latest training: ${new Date(latest.timestamp).toLocaleString()}`)
        console.log(`   - Dataset size: ${latest.datasetSize}`)
        console.log(`   - Overall accuracy: ${(latest.overallAccuracy * 100).toFixed(1)}%`)
      }
    } else {
      console.log('❌ Failed to get training history:', historyResult.error)
    }
    
    // Test 3: Get trained models
    console.log('\n🤖 Testing trained models...')
    const targets = ['savings_capacity', 'spending_trend', 'risk_score', 'goal_achievement']
    
    for (const target of targets) {
      const modelResult = await ApiService.getTrainedModel(target)
      if (modelResult.success) {
        console.log(`✅ ${target} model retrieved`)
        console.log(`   - Algorithm: ${modelResult.metrics.algorithm}`)
        console.log(`   - R² Score: ${modelResult.metrics.rSquared.toFixed(3)}`)
        console.log(`   - Accuracy: ${(modelResult.metrics.accuracy * 100).toFixed(1)}%`)
        console.log(`   - MSE: ${modelResult.metrics.mse.toFixed(2)}`)
      } else {
        console.log(`❌ Failed to get ${target} model:`, modelResult.error)
      }
    }
    
    // Test 4: Export models
    console.log('\n📤 Testing model export...')
    const exportResult = await ApiService.exportTrainedModels()
    if (exportResult.success) {
      console.log('✅ Models exported successfully')
      console.log(`   - Models exported: ${Object.keys(exportResult.models.models).length}`)
      console.log(`   - Training history entries: ${exportResult.models.trainingHistory.length}`)
    } else {
      console.log('❌ Failed to export models:', exportResult.error)
    }
    
    // Test 5: Test with Kaggle dataset (if file exists)
    console.log('\n📊 Testing Kaggle dataset training...')
    const kaggleResult = await ApiService.trainWithDataset('./datasets/kaggle-financial-data.csv', {
      testRatio: 0.2,
      targetColumns: ['savings_capacity', 'spending_trend', 'risk_score', 'goal_achievement'],
      algorithms: ['linear', 'polynomial', 'exponential']
    })
    
    if (kaggleResult.success) {
      console.log('✅ Kaggle dataset training successful')
      console.log(`   - Training records: ${kaggleResult.result.dataset.trainData.features.length}`)
      console.log(`   - Test records: ${kaggleResult.result.dataset.testData.features.length}`)
    } else {
      console.log('⚠️ Kaggle dataset training failed (file may not exist):', kaggleResult.error)
      console.log('   This is expected if the Kaggle dataset file is not present')
    }
    
    // Test 6: Clear models
    console.log('\n🗑️ Testing model clearing...')
    const clearResult = await ApiService.clearTrainedModels()
    if (clearResult.success) {
      console.log('✅ Models cleared successfully')
    } else {
      console.log('❌ Failed to clear models:', clearResult.error)
    }
    
    console.log('\n🎉 Kaggle training testing completed!')
    
  } catch (error) {
    console.error('❌ Error testing Kaggle training:', error)
  }
}

// Run the test
testKaggleTraining()
