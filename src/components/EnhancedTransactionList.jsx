import React, { useState, useEffect } from 'react'
import { ApiService } from '../services/apiService'
import ConfidenceIndicator from './ConfidenceIndicator'

const EnhancedTransactionList = ({ 
  transactions, 
  onTransactionUpdate,
  showMLPredictions = true 
}) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  useEffect(() => {
    let filtered = [...transactions]

    // Apply filters
    switch (filter) {
      case 'ml-predicted':
        filtered = filtered.filter(t => t.is_ml_predicted)
        break
      case 'needs-review':
        filtered = filtered.filter(t => t.ml_confidence < 0.7 && t.is_ml_predicted)
        break
      case 'high-confidence':
        filtered = filtered.filter(t => t.ml_confidence >= 0.8 && t.is_ml_predicted)
        break
      case 'manual-override':
        filtered = filtered.filter(t => t.manual_override)
        break
      default:
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
        break
      case 'amount':
        filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        break
      case 'confidence':
        filtered.sort((a, b) => (b.ml_confidence || 0) - (a.ml_confidence || 0))
        break
      case 'category':
        filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
        break
    }

    setFilteredTransactions(filtered)
  }, [transactions, filter, sortBy])

  const handleMLPredictionUpdate = async (transactionId, newCategory) => {
    try {
      const result = await ApiService.updateMLPrediction(
        transactionId,
        newCategory,
        1.0, // Manual override gets 100% confidence
        false // Not ML predicted anymore
      )
      
      if (result.success && onTransactionUpdate) {
        onTransactionUpdate()
      }
    } catch (error) {
      console.error('Error updating ML prediction:', error)
    }
  }

  const getTransactionTypeColor = (type) => {
    return type === 'income' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100'
  }

  const getMLStatusBadge = (transaction) => {
    if (!showMLPredictions) return null

    if (transaction.manual_override) {
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          Manual Override
        </span>
      )
    }

    if (transaction.is_ml_predicted) {
      return (
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            ML Predicted
          </span>
          <ConfidenceIndicator 
            confidence={transaction.ml_confidence || 0} 
            size="xs"
          />
        </div>
      )
    }

    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
        Manual Entry
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h3>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="ml-predicted">ML Predicted</option>
              <option value="needs-review">Needs Review</option>
              <option value="high-confidence">High Confidence</option>
              <option value="manual-override">Manual Override</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="confidence">Sort by Confidence</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* ML Statistics */}
        {showMLPredictions && (
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {transactions.filter(t => t.is_ml_predicted).length}
              </div>
              <div className="text-gray-600">ML Predicted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {transactions.filter(t => t.ml_confidence < 0.7 && t.is_ml_predicted).length}
              </div>
              <div className="text-gray-600">Need Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.ml_confidence >= 0.8 && t.is_ml_predicted).length}
              </div>
              <div className="text-gray-600">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {transactions.filter(t => t.manual_override).length}
              </div>
              <div className="text-gray-600">Manual Override</div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-200">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {transaction.description}
                    </h4>
                    {getMLStatusBadge(transaction)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type}
                    </span>
                    <span>Category: {transaction.category}</span>
                    <span>Date: {new Date(transaction.transaction_date).toLocaleDateString()}</span>
                    {transaction.account_name && (
                      <span>Account: {transaction.account_name}</span>
                    )}
                  </div>

                  {/* ML Prediction Info */}
                  {showMLPredictions && transaction.is_ml_predicted && (
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        ML Category: <span className="font-medium">{transaction.ml_category}</span>
                      </span>
                      <ConfidenceIndicator 
                        confidence={transaction.ml_confidence || 0}
                        size="xs"
                        showLabel={true}
                      />
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                  </div>
                  
                  {/* Quick Actions */}
                  {showMLPredictions && transaction.ml_confidence < 0.7 && transaction.is_ml_predicted && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleMLPredictionUpdate(transaction.id, transaction.ml_category)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      >
                        Accept ML
                      </button>
                      <button
                        onClick={() => handleMLPredictionUpdate(transaction.id, transaction.category)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        Use Manual
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EnhancedTransactionList
