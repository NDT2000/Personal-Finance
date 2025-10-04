import React from 'react'

const ConfidenceIndicator = ({ 
  confidence, 
  size = 'sm', 
  showPercentage = true,
  showLabel = false 
}) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: '✅'
    }
    if (confidence >= 0.6) return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: '⚠️'
    }
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: '❌'
    }
  }

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs'
      case 'sm':
        return 'px-2 py-1 text-sm'
      case 'md':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-4 py-2 text-base'
      default:
        return 'px-2 py-1 text-sm'
    }
  }

  const colors = getConfidenceColor(confidence)
  const sizeClasses = getSizeClasses(size)

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}>
      <span className="text-xs">{colors.icon}</span>
      {showPercentage && (
        <span className="font-medium">
          {Math.round(confidence * 100)}%
        </span>
      )}
      {showLabel && (
        <span className="text-xs font-medium">
          {getConfidenceLabel(confidence)}
        </span>
      )}
    </div>
  )
}

export default ConfidenceIndicator
