import React, { useState } from 'react'
import { ApiService } from '../services/apiService'
import ConfidenceIndicator from './ConfidenceIndicator'
import { LoadingSpinner } from './LoadingStates'

const SimpleMLTest = () => {
  const [testDescription, setTestDescription] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const testPrediction = async () => {
    if (!testDescription.trim()) {
      setMessage('Please enter a description to test')
      return
    }

    setIsLoading(true)
    setMessage('')
    setPrediction(null)

    try {
      const result = await ApiService.getMLCategorization([testDescription.trim()])
      
      if (result.success && result.predictions && result.predictions.length > 0) {
        setPrediction(result.predictions[0])
        setMessage('AI prediction generated!')
      } else {
        setMessage('Unable to generate prediction. Please try again.')
      }
    } catch (error) {
      console.error('Error testing prediction:', error)
      setMessage('Error testing prediction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearTest = () => {
    setTestDescription('')
    setPrediction(null)
    setMessage('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Test AI Assistant</h3>
      </div>

      <div className="space-y-4">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter a transaction description to test AI categorization:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              placeholder="e.g., 'Starbucks coffee', 'Uber ride', 'Grocery store'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={testPrediction}
              disabled={isLoading || !testDescription.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Test AI'}
            </button>
            <button
              onClick={clearTest}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('Error') || message.includes('Unable') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Prediction Result */}
        {prediction && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">AI Prediction</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Suggested Category:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {prediction.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Confidence:</span>
                <ConfidenceIndicator confidence={prediction.confidence} />
              </div>
              {prediction.confidence < 0.7 && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Low confidence - this prediction may need manual review
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Test Examples */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h4>
          <div className="flex flex-wrap gap-2">
            {['Starbucks coffee', 'Uber ride', 'Grocery store', 'Gas station', 'Netflix subscription'].map((example) => (
              <button
                key={example}
                onClick={() => setTestDescription(example)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleMLTest
