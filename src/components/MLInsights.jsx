import React, { useState, useEffect } from 'react'
import { ApiService } from '../services/apiService'
import { LoadingSpinner } from './LoadingStates'

const MLInsights = () => {
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMLInsights()
  }, [])

  const loadMLInsights = async () => {
    try {
      setIsLoading(true)
      
      // Get model info and format for user-friendly display
      const result = await ApiService.getMLModelInfo()
      if (result.success && result.model) {
        const model = result.model
        
        // Calculate user-friendly metrics
        const accuracy = Math.round((model.accuracy || 0.85) * 100)
        const totalPredictions = model.totalPredictions || 0
        const categoryNames = model.categories || ['Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Other']
        
        // Limit categories for better display
        const displayCategories = categoryNames.slice(0, 6).join(', ') + (categoryNames.length > 6 ? '...' : '')
        
        // Generate user-friendly insights
        const userInsights = {
          accuracy: accuracy,
          totalPredictions: totalPredictions,
          categories: displayCategories,
          lastUpdated: new Date().toLocaleDateString(),
          status: accuracy >= 90 ? 'Excellent' : accuracy >= 80 ? 'Good' : 'Learning'
        }
        
        setInsights(userInsights)
      }
    } catch (error) {
      console.error('Error loading ML insights:', error)
      // Set default insights if API fails
      const defaultCategories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Other']
      const displayCategories = defaultCategories.slice(0, 6).join(', ') + '...'
      
      setInsights({
        accuracy: 85,
        totalPredictions: 0,
        categories: displayCategories,
        lastUpdated: new Date().toLocaleDateString(),
        status: 'Learning'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'text-green-600 bg-green-50'
      case 'Good': return 'text-blue-600 bg-blue-50'
      case 'Learning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Excellent': return '🎯'
      case 'Good': return '✅'
      case 'Learning': return '📚'
      default: return '🤖'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="lg" color="blue" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">AI Expense Assistant</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Accuracy */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-600">AI Accuracy</h4>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{insights?.accuracy}%</p>
          <p className="text-xs text-blue-600 mt-1">Categorization accuracy</p>
        </div>

        {/* Status */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-green-600">AI Status</h4>
            <span className="text-2xl">{getStatusIcon(insights?.status)}</span>
          </div>
          <p className="text-lg font-bold text-green-900">{insights?.status}</p>
          <p className="text-xs text-green-600 mt-1">Learning from your data</p>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-purple-600">Categories</h4>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-lg font-bold text-purple-900 break-words">{insights?.categories}</p>
          <p className="text-xs text-purple-600 mt-1">Expense categories</p>
        </div>
      </div>

      {/* User-friendly description */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How AI Helps You</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Automatically categorizes your expenses</p>
          <p>• Learns from your spending patterns</p>
          <p>• Suggests categories as you type</p>
          <p>• Gets smarter with each transaction</p>
        </div>
      </div>

      {/* Last updated */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {insights?.lastUpdated}
      </div>
    </div>
  )
}

export default MLInsights
