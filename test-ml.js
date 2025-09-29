// Test script for ML service
import { ApiService } from './src/services/apiService.js'

async function testMLService() {
  console.log('🧪 Testing ML Service...\n')
  
  try {
    // Test 1: Get model info
    console.log('📊 Getting model information...')
    const modelInfo = await ApiService.getMLModelInfo()
    if (modelInfo.success) {
      console.log('✅ Model Info:', modelInfo.model)
    } else {
      console.log('❌ Failed to get model info:', modelInfo.error)
    }
    
    // Test 2: Test ML categorization
    console.log('\n🤖 Testing ML categorization...')
    const testDescriptions = [
      'Coffee at Starbucks',
      'Gas station fill up',
      'Netflix subscription',
      'Grocery shopping at Walmart',
      'Doctor visit',
      'Amazon purchase',
      'Electric bill payment',
      'Uber ride to airport'
    ]
    
    const categorization = await ApiService.getMLCategorization(testDescriptions)
    if (categorization.success) {
      console.log('✅ Categorization Results:')
      categorization.predictions.forEach((pred, index) => {
        const confidence = Math.round(pred.confidence * 100)
        const needsReview = pred.confidence < 0.7 ? ' ⚠️ Needs Review' : ''
        console.log(`  ${testDescriptions[index]}: ${pred.category} (${confidence}%)${needsReview}`)
      })
    } else {
      console.log('❌ Failed to categorize:', categorization.error)
    }
    
    // Test 3: Test ML model endpoint
    console.log('\n🔬 Testing ML model endpoint...')
    const testResults = await ApiService.testMLModel()
    if (testResults.success) {
      console.log('✅ Model test results received')
      console.log(`  Test cases: ${testResults.testResults.length}`)
    } else {
      console.log('❌ Failed to test model:', testResults.error)
    }
    
    console.log('\n🎉 ML Service testing completed!')
    
  } catch (error) {
    console.error('❌ Error testing ML service:', error)
  }
}

// Run the test
testMLService()
