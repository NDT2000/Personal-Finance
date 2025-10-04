import React from 'react'

const MLSuggestionCard = ({ 
  suggestion, 
  onAccept, 
  onReject, 
  isLoading = false 
}) => {
  if (!suggestion) return null

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'border-green-200 bg-green-50'
    if (confidence >= 0.6) return 'border-yellow-200 bg-yellow-50'
    return 'border-red-200 bg-red-50'
  }

  const getConfidenceTextColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-800'
    if (confidence >= 0.6) return 'text-yellow-800'
    return 'text-red-800'
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return '✅'
    if (confidence >= 0.6) return '⚠️'
    return '❌'
  }

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence'
    if (confidence >= 0.6) return 'Medium Confidence'
    return 'Low Confidence'
  }

  return (
    <div className={`border-2 rounded-lg p-4 ${getConfidenceColor(suggestion.confidence)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getConfidenceIcon(suggestion.confidence)}</span>
          <div>
            <h4 className="font-semibold text-gray-900">
              ML Suggestion: {suggestion.category}
            </h4>
            <p className={`text-sm font-medium ${getConfidenceTextColor(suggestion.confidence)}`}>
              {getConfidenceLabel(suggestion.confidence)} ({Math.round(suggestion.confidence * 100)}%)
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : 'Accept'}
          </button>
          <button
            onClick={onReject}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Confidence Warning */}
      {suggestion.confidence < 0.7 && (
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-orange-600">⚠️</span>
            <span className="text-sm font-medium text-orange-800">
              Low confidence prediction - please review manually
            </span>
          </div>
        </div>
      )}

      {/* Additional ML Info */}
      <div className="mt-3 text-xs text-gray-600">
        <p>This suggestion is based on pattern matching analysis of your transaction description.</p>
        {suggestion.scores && (
          <div className="mt-2">
            <p className="font-medium">Category Scores:</p>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {Object.entries(suggestion.scores)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 4)
                .map(([category, score]) => (
                  <div key={category} className="flex justify-between">
                    <span className="capitalize">{category}:</span>
                    <span className="font-medium">{Math.round(score * 100)}%</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MLSuggestionCard
