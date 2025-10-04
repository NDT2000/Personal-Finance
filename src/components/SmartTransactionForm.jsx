import React, { useState, useEffect, useCallback } from 'react'
import { ApiService } from '../services/apiService'

const SmartTransactionForm = ({ 
  selectedAccountId, 
  onTransactionAdded, 
  transactionType = 'expense' 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    transactionDate: new Date().toISOString().split('T')[0]
  })
  
  const [mlSuggestion, setMLSuggestion] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMLSuggestion, setShowMLSuggestion] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debounced ML prediction
  const getMLPrediction = useCallback(
    async (description) => {
      // Validate description
      if (!description || typeof description !== 'string' || description.trim().length < 3) {
        setMLSuggestion(null)
        setShowMLSuggestion(false)
        return
      }

      console.log('Getting ML prediction for:', description, 'Type:', typeof description)
      setIsLoading(true)
      try {
        const result = await ApiService.getMLCategorization([description.trim()])
        console.log('ML prediction result:', result)
        if (result.success && result.predictions && result.predictions.length > 0) {
          const prediction = result.predictions[0]
          setMLSuggestion(prediction)
          setShowMLSuggestion(true)
        } else {
          // Clear suggestion if prediction failed
          setMLSuggestion(null)
          setShowMLSuggestion(false)
        }
      } catch (error) {
        console.error('Error getting ML prediction:', error)
        setMLSuggestion(null)
        setShowMLSuggestion(false)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Debounce ML prediction
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.description && typeof formData.description === 'string' && formData.description.trim().length >= 3) {
        console.log('Triggering ML prediction for:', formData.description)
        getMLPrediction(formData.description)
      } else {
        setMLSuggestion(null)
        setShowMLSuggestion(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [formData.description, getMLPrediction])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log('Input change:', name, value, 'Type:', typeof value)
    
    // Ensure value is always a string for description
    const processedValue = name === 'description' ? String(value) : value
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  const handleAcceptMLSuggestion = () => {
    if (mlSuggestion) {
      setFormData(prev => ({
        ...prev,
        category: mlSuggestion.category
      }))
      setShowMLSuggestion(false)
    }
  }

  const handleRejectMLSuggestion = () => {
    setShowMLSuggestion(false)
    setMLSuggestion(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAccountId) {
      alert('Please select an account first')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await ApiService.createTransaction(
        selectedAccountId,
        parseFloat(formData.amount),
        formData.category,
        transactionType,
        formData.description,
        formData.transactionDate
      )

      if (result.success) {
        // Update transaction with ML prediction if available
        if (mlSuggestion && showMLSuggestion) {
          await ApiService.updateMLPrediction(
            result.transactionId,
            mlSuggestion.category,
            mlSuggestion.confidence,
            true
          )
        }

        // Reset form
        setFormData({
          description: '',
          amount: '',
          category: '',
          transactionDate: new Date().toISOString().split('T')[0]
        })
        setMLSuggestion(null)
        setShowMLSuggestion(false)
        
        if (onTransactionAdded) {
          onTransactionAdded()
        }
        
        alert('Transaction added successfully!')
      } else {
        alert('Error adding transaction: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting transaction:', error)
      alert('Error adding transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return '✅'
    if (confidence >= 0.6) return '⚠️'
    return '❌'
  }

  const categories = transactionType === 'income' 
    ? ['salary', 'freelance', 'bonus', 'investment', 'business', 'other']
    : ['housing', 'food', 'transportation', 'utilities', 'healthcare', 'entertainment', 'shopping', 'other']

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">
        Add {transactionType === 'income' ? 'Income' : 'Expense'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description with ML Suggestions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter transaction description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {/* ML Suggestion Display */}
          {showMLSuggestion && mlSuggestion && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-900">
                    ML Suggestion: {mlSuggestion.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(mlSuggestion.confidence)}`}>
                    {getConfidenceIcon(mlSuggestion.confidence)} {Math.round(mlSuggestion.confidence * 100)}% confidence
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleAcceptMLSuggestion}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectMLSuggestion}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              {mlSuggestion.confidence < 0.7 && (
                <div className="text-sm text-orange-600 font-medium">
                  ⚠️ Low confidence - please review manually
                </div>
              )}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Adding...' : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </div>
  )
}

export default SmartTransactionForm
