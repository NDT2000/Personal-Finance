// Direct test of training functionality
import modelTrainer from './src/services/modelTrainer.js'

async function testTrainingDirect() {
  console.log('🧪 Testing training directly...\n')
  
  try {
    console.log('1. Testing sample data training...')
    const result = await modelTrainer.trainWithSampleData()
    console.log('✅ Sample training successful')
    console.log(`   - Training records: ${result.dataset.trainData.features.length}`)
    console.log(`   - Test records: ${result.dataset.testData.features.length}`)
    console.log(`   - Features: ${result.dataset.metadata.featureCount}`)
    
    console.log('\n2. Testing model metrics...')
    const metrics = result.trainingResults.metrics
    Object.entries(metrics).forEach(([target, metric]) => {
      console.log(`   - ${target}: R²=${metric.rSquared.toFixed(3)}, Accuracy=${(metric.accuracy * 100).toFixed(1)}%`)
    })
    
    console.log('\n🎉 Direct training test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error in direct training test:', error)
    console.error('Stack trace:', error.stack)
  }
}

testTrainingDirect()
