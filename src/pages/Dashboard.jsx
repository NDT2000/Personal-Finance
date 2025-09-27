import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Salary', amount: 5000, type: 'income', date: '2024-01-01' },
    { id: 2, description: 'Rent', amount: -1200, type: 'expense', date: '2024-01-02' },
    { id: 3, description: 'Groceries', amount: -150, type: 'expense', date: '2024-01-03' },
  ])

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense'
  })

  const addTransaction = (e) => {
    e.preventDefault()
    if (!newTransaction.description || !newTransaction.amount) return

    const transaction = {
      id: Date.now(),
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      date: new Date().toISOString().split('T')[0]
    }

    setTransactions([...transactions, transaction])
    setNewTransaction({ description: '', amount: '', type: 'expense' })
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Finance</h1>
            <p className="text-gray-600">Track your income and expenses</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Income</h3>
            <p className="text-2xl font-bold text-success-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-danger-600">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Transaction Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={addTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="input"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="input"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Add Transaction
              </button>
            </form>
          </div>

          {/* Transaction List */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-gray-400 hover:text-danger-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard