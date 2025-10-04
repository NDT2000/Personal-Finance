import React, { useState, useEffect } from 'react'
import { ApiService } from '../services/apiService'
import { LoadingSpinner, ProgressBar } from './LoadingStates'

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalTransactions: 0,
    aiCategorized: 0,
    accuracy: 0,
    timeSaved: 0,
    categories: 8
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    loadPerformanceMetrics()
    const interval = setInterval(loadPerformanceMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadPerformanceMetrics = async () => {
    try {
      setIsLoading(true)
      
      // Simulate user-friendly metrics (in real app, these would come from analytics)
      const mockMetrics = {
        totalTransactions: Math.floor(Math.random() * 500) + 200,
        aiCategorized: Math.floor(Math.random() * 400) + 150,
        accuracy: Math.random() * 0.15 + 0.85, // 85-100%
        timeSaved: Math.floor(Math.random() * 20) + 5, // 5-25 minutes
        categories: 8
      }
      
      setMetrics(mockMetrics)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading performance metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 0.95) return 'green'
    if (accuracy >= 0.85) return 'yellow'
    return 'red'
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Your AI Assistant</h3>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated?.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Transactions */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-900">{metrics.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* AI Categorized */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">AI Categorized</p>
              <p className="text-2xl font-bold text-green-900">
                {metrics.aiCategorized.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar 
              progress={(metrics.aiCategorized / metrics.totalTransactions) * 100} 
              color="green"
            />
          </div>
        </div>

        {/* Time Saved */}
        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Time Saved</p>
              <p className="text-2xl font-bold text-yellow-900">{metrics.timeSaved} min</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">AI Accuracy</p>
              <p className="text-2xl font-bold text-purple-900">
                {Math.round(metrics.accuracy * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar 
              progress={metrics.accuracy * 100} 
              color={getAccuracyColor(metrics.accuracy)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Categories</p>
              <p className="text-2xl font-bold text-indigo-900">
                {metrics.categories}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">Operational</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceDashboard
