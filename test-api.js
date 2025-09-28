// Simple test script to check if the API server is working
import fetch from 'node-fetch'

async function testAPI() {
  try {
    console.log('Testing API server...')
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3001/api/health')
    const healthData = await healthResponse.json()
    console.log('Health check:', healthData)
    
    // Test dashboard endpoint
    const dashboardResponse = await fetch('http://localhost:3001/api/dashboard/1')
    const dashboardData = await dashboardResponse.json()
    console.log('Dashboard check:', dashboardData)
    
  } catch (error) {
    console.error('API test failed:', error.message)
  }
}

testAPI()
