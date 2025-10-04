import React, { useState, useEffect } from 'react'
import bankIntegration from '../../services/bankIntegration'

const BankConnections = ({ userId, onTransactionsImported }) => {
  const [connections, setConnections] = useState([])
  const [supportedBanks, setSupportedBanks] = useState([])
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState([])

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const banks = bankIntegration.getSupportedBanks()
      const userConnections = bankIntegration.getUserConnections(userId)
      
      setSupportedBanks(banks)
      setConnections(userConnections)
    } catch (error) {
      console.error('Error loading bank data:', error)
    }
  }

  const handleConnectBank = async (bankId) => {
    try {
      setIsConnecting(true)
      
      // In a real implementation, this would open OAuth flow
      // For demo purposes, we'll simulate the connection
      const credentials = {
        accountId: `acc_${bankId}_${Date.now()}`,
        // In real implementation, these would come from OAuth
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token'
      }
      
      const result = await bankIntegration.connectBankAccount(userId, bankId, credentials)
      
      if (result.success) {
        await loadData() // Refresh connections
        setShowConnectModal(false)
        setSelectedBank(null)
      } else {
        alert(`Failed to connect: ${result.error}`)
      }
    } catch (error) {
      console.error('Error connecting bank:', error)
      alert(`Connection failed: ${error.message}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSyncAccount = async (connectionId) => {
    try {
      setIsSyncing(true)
      
      const connection = connections.find(c => c.id === connectionId)
      if (!connection) return
      
      // Sync transactions from last sync date to now
      const result = await bankIntegration.importTransactions(
        connectionId,
        connection.lastSync,
        new Date().toISOString().split('T')[0]
      )
      
      if (result.success) {
        // Categorize transactions using ML
        const categorizedResult = await bankIntegration.categorizeTransactions(result.transactions)
        
        if (categorizedResult.success) {
          // Notify parent component about imported transactions
          if (onTransactionsImported) {
            onTransactionsImported(categorizedResult.transactions)
          }
          
          setSyncResults(prev => [...prev, {
            connectionId,
            bankName: connection.bankName,
            importedCount: result.importedCount,
            timestamp: new Date().toISOString()
          }])
        }
        
        await loadData() // Refresh connections
      } else {
        alert(`Sync failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error syncing account:', error)
      alert(`Sync failed: ${error.message}`)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSyncAll = async () => {
    try {
      setIsSyncing(true)
      
      const result = await bankIntegration.syncAllAccounts(userId)
      
      if (result.success) {
        setSyncResults(result.results)
        
        // Calculate total imported transactions
        const totalImported = result.results
          .filter(r => r.status === 'success')
          .reduce((sum, r) => sum + r.importedCount, 0)
        
        if (totalImported > 0 && onTransactionsImported) {
          // In a real implementation, we'd pass the actual transactions
          onTransactionsImported([])
        }
        
        await loadData() // Refresh connections
      } else {
        alert(`Sync failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error syncing all accounts:', error)
      alert(`Sync failed: ${error.message}`)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnect = async (connectionId) => {
    if (!confirm('Are you sure you want to disconnect this bank account?')) return
    
    try {
      const result = await bankIntegration.disconnectBankAccount(connectionId)
      
      if (result.success) {
        await loadData() // Refresh connections
      } else {
        alert(`Failed to disconnect: ${result.error}`)
      }
    } catch (error) {
      console.error('Error disconnecting bank:', error)
      alert(`Disconnect failed: ${error.message}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50'
      case 'disconnected': return 'text-red-600 bg-red-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Bank Connections</h3>
            <p className="text-gray-600">Connect your bank accounts to automatically import transactions</p>
          </div>
          <div className="flex space-x-3">
            {connections.length > 0 && (
              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
              </button>
            )}
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Connect Bank</span>
            </button>
          </div>
        </div>

        {/* Sync Results */}
        {syncResults.length > 0 && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Recent Sync Results</h4>
            <div className="space-y-2">
              {syncResults.map((result, index) => (
                <div key={index} className="text-sm text-green-700">
                  {result.bankName}: {result.importedCount} transactions imported
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connected Accounts */}
      {connections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((connection) => (
            <div key={connection.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{connection.bankName}</h4>
                    <p className="text-sm text-gray-600">Account: {connection.accountId}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(connection.status)}`}>
                  {connection.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Connected:</span> {new Date(connection.connectedAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last Sync:</span> {new Date(connection.lastSync).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSyncAccount(connection.id)}
                  disabled={isSyncing}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync</span>
                </button>
                <button
                  onClick={() => handleDisconnect(connection.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bank Accounts Connected</h3>
          <p className="text-gray-600 mb-4">Connect your bank accounts to automatically import transactions and track your financial goals.</p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Connect Your First Bank</span>
          </button>
        </div>
      )}

      {/* Connect Bank Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Connect Bank Account</h3>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportedBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleConnectBank(bank.id)}
                    disabled={isConnecting}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">{bank.name}</h4>
                      <p className="text-sm text-gray-600">Click to connect</p>
                    </div>
                  </button>
                ))}
              </div>
              
              {isConnecting && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="text-blue-700">Connecting to bank...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BankConnections
