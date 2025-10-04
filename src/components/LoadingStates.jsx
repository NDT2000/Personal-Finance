import React from 'react'

// ML Prediction Loading Skeleton
export const MLPredictionSkeleton = () => (
  <div className="mt-2 p-3 bg-gray-50 rounded-lg animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
)

// Transaction List Skeleton
export const TransactionListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-6 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

// Goals Dashboard Skeleton
export const GoalsDashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
)

// ML Test Component Skeleton
export const MLTestSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
)

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }
  
  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Progress Bar Component
export const ProgressBar = ({ progress, color = 'blue', showPercentage = true }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}
