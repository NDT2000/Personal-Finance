import React, { useState, useEffect } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const InvestmentTracker = ({ userId }) => {
  const [portfolios, setPortfolios] = useState([])
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadPortfolios()
  }, [userId])

  const loadPortfolios = async () => {
    try {
      setLoading(true)
      // Mock data - in real implementation, this would come from APIs
      const mockPortfolios = [
        {
          id: 1,
          name: 'Retirement Portfolio',
          totalValue: 125000,
          totalGain: 15000,
          totalGainPercent: 13.6,
          assets: [
            { symbol: 'VTI', name: 'Vanguard Total Stock Market', shares: 100, price: 250, value: 25000, allocation: 20 },
            { symbol: 'VXUS', name: 'Vanguard Total International', shares: 80, price: 60, value: 4800, allocation: 3.8 },
            { symbol: 'BND', name: 'Vanguard Total Bond Market', shares: 200, price: 80, value: 16000, allocation: 12.8 },
            { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, price: 180, value: 9000, allocation: 7.2 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, price: 350, value: 10500, allocation: 8.4 }
          ],
          goalAmount: 500000,
          goalDate: '2035-12-31'
        },
        {
          id: 2,
          name: 'Emergency Fund',
          totalValue: 15000,
          totalGain: 500,
          totalGainPercent: 3.4,
          assets: [
            { symbol: 'VMFXX', name: 'Vanguard Federal Money Market', shares: 15000, price: 1, value: 15000, allocation: 100 }
          ],
          goalAmount: 25000,
          goalDate: '2025-06-30'
        }
      ]
      
      setPortfolios(mockPortfolios)
      if (mockPortfolios.length > 0) {
        setSelectedPortfolio(mockPortfolios[0])
        loadPerformance(mockPortfolios[0].id)
      }
    } catch (error) {
      console.error('Error loading portfolios:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPerformance = async (portfolioId) => {
    try {
      // Mock performance data
      const mockPerformance = {
        dailyReturns: [
          { date: '2024-01-01', value: 100000 },
          { date: '2024-01-02', value: 101000 },
          { date: '2024-01-03', value: 100500 },
          { date: '2024-01-04', value: 102000 },
          { date: '2024-01-05', value: 103500 },
          { date: '2024-01-06', value: 102800 },
          { date: '2024-01-07', value: 104200 },
          { date: '2024-01-08', value: 105000 },
          { date: '2024-01-09', value: 104500 },
          { date: '2024-01-10', value: 106000 }
        ],
        monthlyReturns: [
          { month: 'Jan', return: 2.5 },
          { month: 'Feb', return: -1.2 },
          { month: 'Mar', return: 3.8 },
          { month: 'Apr', return: 1.5 },
          { month: 'May', return: -0.8 },
          { month: 'Jun', return: 4.2 }
        ],
        yearlyReturn: 12.5,
        volatility: 8.2,
        sharpeRatio: 1.52
      }
      
      setPerformance(mockPerformance)
    } catch (error) {
      console.error('Error loading performance:', error)
    }
  }

  const getPerformanceChartData = () => {
    if (!performance?.dailyReturns) return null

    const data = {
      labels: performance.dailyReturns.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Portfolio Value',
          data: performance.dailyReturns.map(d => d.value),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Portfolio Performance'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        }
      }
    }

    return { data, options }
  }

  const getAllocationChartData = () => {
    if (!selectedPortfolio?.assets) return null

    const data = {
      labels: selectedPortfolio.assets.map(a => a.symbol),
      datasets: [
        {
          data: selectedPortfolio.assets.map(a => a.allocation),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
          ],
          borderWidth: 0
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Asset Allocation'
        },
        legend: {
          position: 'bottom'
        }
      }
    }

    return { data, options }
  }

  const getMonthlyReturnsChartData = () => {
    if (!performance?.monthlyReturns) return null

    const data = {
      labels: performance.monthlyReturns.map(m => m.month),
      datasets: [
        {
          label: 'Monthly Return (%)',
          data: performance.monthlyReturns.map(m => m.return),
          backgroundColor: performance.monthlyReturns.map(m => 
            m.return >= 0 ? '#10B981' : '#EF4444'
          ),
          borderColor: performance.monthlyReturns.map(m => 
            m.return >= 0 ? '#059669' : '#DC2626'
          ),
          borderWidth: 1
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Returns'
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }

    return { data, options }
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
            <h3 className="text-xl font-semibold text-gray-900">Investment Portfolios</h3>
            <p className="text-gray-600">Track your investment performance and portfolio allocation</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Portfolio</span>
          </button>
        </div>

        {/* Portfolio Selector */}
        {portfolios.length > 0 && (
          <div className="flex space-x-2 mb-4">
            {portfolios.map((portfolio) => (
              <button
                key={portfolio.id}
                onClick={() => {
                  setSelectedPortfolio(portfolio)
                  loadPerformance(portfolio.id)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedPortfolio?.id === portfolio.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {portfolio.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPortfolio && (
        <>
          {/* Portfolio Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-600">Total Value</div>
                <div className="text-2xl font-bold text-blue-900">
                  ${selectedPortfolio.totalValue.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-green-600">Total Gain</div>
                <div className="text-2xl font-bold text-green-900">
                  ${selectedPortfolio.totalGain.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-600">Gain %</div>
                <div className="text-2xl font-bold text-purple-900">
                  {selectedPortfolio.totalGainPercent.toFixed(1)}%
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm font-medium text-orange-600">Goal Progress</div>
                <div className="text-2xl font-bold text-orange-900">
                  {((selectedPortfolio.totalValue / selectedPortfolio.goalAmount) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          {getPerformanceChartData() && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Chart</h4>
              <div className="h-64">
                <Line {...getPerformanceChartData()} />
              </div>
            </div>
          )}

          {/* Asset Allocation */}
          {getAllocationChartData() && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <Doughnut {...getAllocationChartData()} />
                </div>
                <div className="space-y-3">
                  {selectedPortfolio.assets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5] }}></div>
                        <div>
                          <div className="font-medium text-gray-900">{asset.symbol}</div>
                          <div className="text-sm text-gray-600">{asset.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{asset.allocation.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">${asset.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monthly Returns */}
          {getMonthlyReturnsChartData() && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Returns</h4>
              <div className="h-64">
                <Line {...getMonthlyReturnsChartData()} />
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {performance && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-600">Yearly Return</div>
                  <div className="text-2xl font-bold text-green-900">
                    {performance.yearlyReturn.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-600">Volatility</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {performance.volatility.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-600">Sharpe Ratio</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {performance.sharpeRatio.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* No portfolios message */}
      {portfolios.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investment Portfolios</h3>
          <p className="text-gray-600 mb-4">Create your first investment portfolio to start tracking your investments.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Portfolio</span>
          </button>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add Investment Portfolio</h3>
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
            
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h4>
                <p className="text-gray-600">
                  Portfolio creation feature will be available in the next update.
                </p>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvestmentTracker
