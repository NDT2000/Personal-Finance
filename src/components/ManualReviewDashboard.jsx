import React, { useState, useEffect } from 'react'
import { ApiService } from '../services/apiService'
import ConfidenceIndicator from './ConfidenceIndicator'

const ManualReviewDashboard = ({ onReviewComplete }) => {
  const [reviewTransactions, setReviewTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransactions, setSelectedTransactions] = useState(new Set())
  const [bulkCategory, setBulkCategory] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadReviewTransactions()
  }, [])

  const loadReviewTransactions = async () => {
    setIsLoading(true)
    try {
      const result = await ApiService.getMLReviewTransactions()
      if (result.success) {
        setReviewTransactions(result.transactions)
      }
    } catch (error) {
      console.error('Error loading review transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionUpdate = async (transactionId, newCategory, isMLPredicted = false) => {
    try {
      const result = await ApiService.updateMLPrediction(
        transactionId,
        newCategory,
        isMLPredicted ? 1.0 : 0.9, // Manual corrections get high confidence
        isMLPredicted
      )
      
      if (result.success) {
        // Remove from review list
        setReviewTransactions(prev => 
          prev.filter(t => t.id !== transactionId)
        )
        
        if (onReviewComplete) {
          onReviewComplete()
        }
      }
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const handleBulkUpdate = async () => {
    if (selectedTransactions.size === 0 || !bulkCategory) return

    setIsProcessing(true)
    try {
      const promises = Array.from(selectedTransactions).map(transactionId => 
        ApiService.updateMLPrediction(transactionId, bulkCategory, 0.9, false)
      )
      
      await Promise.all(promises)
      
      // Remove updated transactions from review list
      setReviewTransactions(prev => 
        prev.filter(t => !selectedTransactions.has(t.id))
      )
      setSelectedTransactions(new Set())
      setBulkCategory('')
      
      if (onReviewComplete) {
        onReviewComplete()
      }
    } catch (error) {
      console.error('Error in bulk update:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectTransaction = (transactionId) => {
    const newSelected = new Set(selectedTransactions)
    if (newSelected.has(transactionId)) {
      newSelected.delete(transactionId)
    } else {
      newSelected.add(transactionId)
    }
    setSelectedTransactions(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedTransactions.size === reviewTransactions.length) {
      setSelectedTransactions(new Set())
    } else {
      setSelectedTransactions(new Set(reviewTransactions.map(t => t.id)))
    }
  }

  const categories = [
    'housing', 'food', 'transportation', 'utilities', 
    'healthcare', 'entertainment', 'shopping', 'other'
  ]

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading review transactions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              ML Review Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              {reviewTransactions.length} transactions need manual review
            </p>
          </div>
          
          {reviewTransactions.length > 0 && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {selectedTransactions.size === reviewTransactions.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTransactions.size > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedTransactions.size} transactions selected
            </span>
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category for bulk update</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkUpdate}
              disabled={!bulkCategory || isProcessing}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Apply to Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="divide-y divide-gray-200">
        {reviewTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600">
              No transactions currently need manual review.
            </p>
          </div>
        ) : (
          reviewTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedTransactions.has(transaction.id)}
                  onChange={() => handleSelectTransaction(transaction.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                
                {/* Transaction Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <ConfidenceIndicator 
                        confidence={transaction.ml_confidence || 0}
                        size="sm"
                        showLabel={true}
                      />
                      <span className="text-lg font-semibold text-red-600">
                        -${parseFloat(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>Date: {new Date(transaction.transaction_date).toLocaleDateString()}</span>
                    <span>Account: {transaction.account_name}</span>
                    <span>Current Category: {transaction.category}</span>
                  </div>

                  {/* ML Prediction vs Manual Category */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-yellow-800">
                          ML Predicted: {transaction.ml_category}
                        </span>
                        <span className="ml-2 text-sm text-yellow-600">
                          (Confidence: {Math.round((transaction.ml_confidence || 0) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-yellow-800">
                          Manual Category: {transaction.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTransactionUpdate(transaction.id, transaction.ml_category, true)}
                      className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Accept ML Prediction
                    </button>
                    <button
                      onClick={() => handleTransactionUpdate(transaction.id, transaction.category, false)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Keep Manual Category
                    </button>
                    <select
                      onChange={(e) => handleTransactionUpdate(transaction.id, e.target.value, false)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose different category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManualReviewDashboard
