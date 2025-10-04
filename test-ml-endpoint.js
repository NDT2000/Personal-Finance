// Test script to verify ML endpoint is working
import fetch from 'node-fetch'

async function testMLEndpoint() {
  console.log('🧪 Testing ML endpoint...')
  
  try {
    // Test 1: Basic health check
    console.log('\n1. Testing health endpoint...')
    const healthResponse = await fetch('http://localhost:3001/api/health')
    const healthData = await healthResponse.json()
    console.log('✅ Health check:', healthData)
    
    // Test 2: Test ML endpoint with valid data
    console.log('\n2. Testing ML categorize endpoint...')
    const mlResponse = await fetch('http://localhost:3001/api/ml/categorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        descriptions: ['Coffee at Starbucks', 'Gas station fill up']
      })
    })
    
    if (!mlResponse.ok) {
      console.error('❌ ML endpoint failed:', mlResponse.status, mlResponse.statusText)
      const errorText = await mlResponse.text()
      console.error('Error response:', errorText)
      return
    }
    
    const mlData = await mlResponse.json()
    console.log('✅ ML categorize response:', mlData)
    
    // Test 3: Test ML info endpoint
    console.log('\n3. Testing ML info endpoint...')
    const infoResponse = await fetch('http://localhost:3001/api/ml/info')
    const infoData = await infoResponse.json()
    console.log('✅ ML info response:', infoData)
    
    console.log('\n🎉 All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Wait a moment for server to start, then run tests
setTimeout(testMLEndpoint, 2000)
