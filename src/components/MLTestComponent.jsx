import React, { useState, useEffect } from 'react'
import { ApiService } from '../services/apiService'

const MLTestComponent = () => {
  const [testResults, setTestResults] = useState(null)
  const [modelInfo, setModelInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testMLModel = async () => {
    setIsLoading(true)
    try {
      const result = await ApiService.testMLModel()
      if (result.success) {
        setTestResults(result.testResults)
      }
    } catch (error) {
      console.error('Error testing ML model:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getModelInfo = async () => {
    try {
      const result = await ApiService.getMLModelInfo()
      if (result.success) {
        setModelInfo(result.model)
      }
    } catch (error) {
      console.error('Error getting model info:', error)
    }
  }

  useEffect(() => {
    getModelInfo()
  }, [])

  const testCustomDescription = async () => {
    const customDescription = prompt('Enter a transaction description to test:')
    if (customDescription) {
      setIsLoading(true)
      try {
        const result = await ApiService.getMLCategorization([customDescription])
        if (result.success) {
          const prediction = result.predictions[0]
          alert(`Prediction: ${prediction.category} (${Math.round(prediction.confidence * 100)}% confidence)`)
        }
      } catch (error) {
        console.error('Error testing custom description:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🤖 ML Model Testing</h2>
          <p className="text-gray-600">Test the expense categorization model</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={testMLModel}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Testing...' : 'Test Model'}
          </button>
          <button
            onClick={testCustomDescription}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Test Custom
          </button>
        </div>
      </div>

      {/* Model Info */}
      {modelInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Model Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Version</span>
              <p className="text-lg font-semibold">{modelInfo.version}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Categories</span>
              <p className="text-lg font-semibold">{modelInfo.categories.length}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Training Data</span>
              <p className="text-lg font-semibold">{modelInfo.trainingDataSize} examples</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Confidence Threshold</span>
              <p className="text-lg font-semibold">{Math.round(modelInfo.confidenceThreshold * 100)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          <div className="grid gap-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {result.description || `Test Case ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Predicted: <span className="font-semibold text-blue-600">{result.category}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.confidence > 0.8 
                      ? 'bg-green-100 text-green-800' 
                      : result.confidence > 0.6 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {Math.round(result.confidence * 100)}% confidence
                  </div>
                  {result.confidence < 0.7 && (
                    <span className="text-xs text-orange-600 font-medium">
                      ⚠️ Needs Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {modelInfo && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Supported Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {modelInfo.categories.map((category, index) => (
              <div key={index} className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-center font-medium">
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MLTestComponent
