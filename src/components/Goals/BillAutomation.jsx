import React, { useState, useEffect } from 'react'

const BillAutomation = ({ userId }) => {
  const [bills, setBills] = useState([])
  const [upcomingBills, setUpcomingBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    isRecurring: false,
    frequency: 'monthly',
    autoPay: false
  })

  useEffect(() => {
    loadBills()
  }, [userId])

  const loadBills = async () => {
    try {
      setLoading(true)
      // Mock data - in real implementation, this would come from APIs
      const mockBills = [
        {
          id: 1,
          name: 'Electric Bill',
          amount: 120.50,
          dueDate: '2024-01-15',
          category: 'Utilities',
          isRecurring: true,
          frequency: 'monthly',
          autoPay: true,
          status: 'paid',
          paidDate: '2024-01-10'
        },
        {
          id: 2,
          name: 'Internet Bill',
          amount: 79.99,
          dueDate: '2024-01-20',
          category: 'Utilities',
          isRecurring: true,
          frequency: 'monthly',
          autoPay: true,
          status: 'upcoming',
          paidDate: null
        },
        {
          id: 3,
          name: 'Credit Card Payment',
          amount: 450.00,
          dueDate: '2024-01-25',
          category: 'Debt',
          isRecurring: true,
          frequency: 'monthly',
          autoPay: false,
          status: 'upcoming',
          paidDate: null
        },
        {
          id: 4,
          name: 'Car Insurance',
          amount: 180.00,
          dueDate: '2024-02-01',
          category: 'Insurance',
          isRecurring: true,
          frequency: 'monthly',
          autoPay: true,
          status: 'upcoming',
          paidDate: null
        }
      ]
      
      setBills(mockBills)
      
      // Calculate upcoming bills (next 30 days)
      const today = new Date()
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      const upcoming = mockBills.filter(bill => {
        const dueDate = new Date(bill.dueDate)
        return dueDate >= today && dueDate <= nextMonth && bill.status === 'upcoming'
      })
      
      setUpcomingBills(upcoming)
    } catch (error) {
      console.error('Error loading bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBill = async () => {
    try {
      const billData = {
        ...newBill,
        id: Date.now(),
        amount: parseFloat(newBill.amount),
        status: 'upcoming',
        paidDate: null
      }
      
      setBills(prev => [...prev, billData])
      setNewBill({
        name: '',
        amount: '',
        dueDate: '',
        category: '',
        isRecurring: false,
        frequency: 'monthly',
        autoPay: false
      })
      setShowAddModal(false)
      
      // Refresh upcoming bills
      await loadBills()
    } catch (error) {
      console.error('Error adding bill:', error)
    }
  }

  const handlePayBill = async (billId) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
          : bill
      ))
      
      // Refresh upcoming bills
      await loadBills()
    } catch (error) {
      console.error('Error paying bill:', error)
    }
  }

  const handleToggleAutoPay = async (billId) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, autoPay: !bill.autoPay }
          : bill
      ))
    } catch (error) {
      console.error('Error toggling auto pay:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50'
      case 'upcoming': return 'text-yellow-600 bg-yellow-50'
      case 'overdue': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Utilities':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'Insurance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'Debt':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5M10 9l2 2 4-4" />
          </svg>
        )
    }
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Bill Payment Automation</h3>
            <p className="text-gray-600">Manage your recurring bills and automate payments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Bill</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-600">Total Bills</div>
            <div className="text-2xl font-bold text-blue-900">{bills.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm font-medium text-yellow-600">Upcoming</div>
            <div className="text-2xl font-bold text-yellow-900">{upcomingBills.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-600">Auto Pay</div>
            <div className="text-2xl font-bold text-green-900">
              {bills.filter(b => b.autoPay).length}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills (Next 30 Days)</h4>
          <div className="space-y-3">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getCategoryIcon(bill.category)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{bill.name}</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{getDaysUntilDue(bill.dueDate)} days</span>
                      {bill.isRecurring && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{bill.frequency}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${bill.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {bill.autoPay ? 'Auto Pay' : 'Manual'}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!bill.autoPay && (
                      <button
                        onClick={() => handlePayBill(bill.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm"
                      >
                        Pay Now
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleAutoPay(bill.id)}
                      className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                        bill.autoPay
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {bill.autoPay ? 'Auto On' : 'Auto Off'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Bills */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">All Bills</h4>
        <div className="space-y-3">
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getCategoryIcon(bill.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-semibold text-gray-900">{bill.name}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                    {bill.isRecurring && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{bill.frequency}</span>
                      </>
                    )}
                    {bill.autoPay && (
                      <>
                        <span>•</span>
                        <span className="text-green-600">Auto Pay</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ${bill.amount.toFixed(2)}
                  </div>
                  {bill.paidDate && (
                    <div className="text-sm text-green-600">
                      Paid: {new Date(bill.paidDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {bill.status === 'upcoming' && !bill.autoPay && (
                    <button
                      onClick={() => handlePayBill(bill.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm"
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleAutoPay(bill.id)}
                    className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                      bill.autoPay
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {bill.autoPay ? 'Auto On' : 'Auto Off'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add New Bill</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Name</label>
                <input
                  type="text"
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Electric Bill"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newBill.category}
                  onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Category</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Debt">Debt</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newBill.isRecurring}
                    onChange={(e) => setNewBill({ ...newBill, isRecurring: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Recurring Bill</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newBill.autoPay}
                    onChange={(e) => setNewBill({ ...newBill, autoPay: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Auto Pay</span>
                </label>
              </div>
              
              {newBill.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={newBill.frequency}
                    onChange={(e) => setNewBill({ ...newBill, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBill}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
                >
                  Add Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillAutomation
