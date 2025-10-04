// Test script to verify server endpoints are working
import fetch from 'node-fetch'

async function testServerEndpoints() {
  console.log('🧪 Testing Server Endpoints...\n')
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...')
    const healthResponse = await fetch('http://localhost:3001/api/health')
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ Health check:', healthData)
    } else {
      console.log('❌ Health check failed:', healthResponse.status)
      return
    }
    
    // Test 2: Sample training
    console.log('\n2. Testing sample training...')
    const sampleResponse = await fetch('http://localhost:3001/api/training/train-sample', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (sampleResponse.ok) {
      const sampleData = await sampleResponse.json()
      console.log('✅ Sample training successful')
      console.log(`   - Training records: ${sampleData.result?.dataset?.trainData?.features?.length || 0}`)
      console.log(`   - Test records: ${sampleData.result?.dataset?.testData?.features?.length || 0}`)
    } else {
      const errorText = await sampleResponse.text()
      console.log('❌ Sample training failed:', sampleResponse.status, errorText)
    }
    
    // Test 3: Dataset training with sample file
    console.log('\n3. Testing dataset training...')
    const datasetResponse = await fetch('http://localhost:3001/api/training/train-dataset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filePath: './datasets/sample-financial-data.csv',
        options: {
          testRatio: 0.2,
          targetColumns: ['savings_capacity', 'spending_trend', 'risk_score', 'goal_achievement'],
          algorithms: ['linear', 'polynomial', 'exponential']
        }
      })
    })
    
    if (datasetResponse.ok) {
      const datasetData = await datasetResponse.json()
      console.log('✅ Dataset training successful')
      console.log(`   - Training records: ${datasetData.result?.dataset?.trainData?.features?.length || 0}`)
      console.log(`   - Test records: ${datasetData.result?.dataset?.testData?.features?.length || 0}`)
    } else {
      const errorText = await datasetResponse.text()
      console.log('❌ Dataset training failed:', datasetResponse.status, errorText)
    }
    
    // Test 4: Training history
    console.log('\n4. Testing training history...')
    const historyResponse = await fetch('http://localhost:3001/api/training/history')
    if (historyResponse.ok) {
      const historyData = await historyResponse.json()
      console.log('✅ Training history retrieved')
      console.log(`   - History entries: ${historyData.history?.length || 0}`)
    } else {
      console.log('❌ Training history failed:', historyResponse.status)
    }
    
    console.log('\n🎉 Server endpoint testing completed!')
    
  } catch (error) {
    console.error('❌ Error testing server endpoints:', error)
  }
}

// Wait a moment for server to start, then run tests
setTimeout(testServerEndpoints, 2000)
