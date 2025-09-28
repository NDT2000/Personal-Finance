import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const SpendingCategoriesChart = ({ transactions }) => {
  // Categorize expenses
  const categories = {}
  
  transactions
    .filter(transaction => transaction.transaction_type === 'expense')
    .forEach(transaction => {
      const category = getCategoryFromDescription(transaction.description)
      if (!categories[category]) {
        categories[category] = 0
      }
      categories[category] += Math.abs(transaction.amount)
    })

  const categoryData = Object.entries(categories).map(([category, amount]) => ({
    category,
    amount
  })).sort((a, b) => b.amount - a.amount)

  const colors = [
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(34, 197, 94, 0.8)',   // Green
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(168, 85, 247, 0.8)',  // Purple
    'rgba(245, 158, 11, 0.8)',  // Yellow
    'rgba(236, 72, 153, 0.8)',  // Pink
    'rgba(14, 165, 233, 0.8)',  // Sky
    'rgba(34, 197, 94, 0.8)',   // Emerald
  ]

  const data = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.amount),
        backgroundColor: colors.slice(0, categoryData.length),
        borderColor: colors.slice(0, categoryData.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: 'Spending by Category',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#374151'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`
          }
        }
      }
    },
    interaction: {
      intersect: false
    }
  }

  // Helper function to categorize expenses
  function getCategoryFromDescription(description) {
    const desc = description.toLowerCase()
    
    if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('housing')) {
      return 'Housing'
    } else if (desc.includes('food') || desc.includes('grocery') || desc.includes('restaurant') || desc.includes('dining')) {
      return 'Food & Dining'
    } else if (desc.includes('transport') || desc.includes('gas') || desc.includes('car') || desc.includes('uber') || desc.includes('taxi')) {
      return 'Transportation'
    } else if (desc.includes('utility') || desc.includes('electric') || desc.includes('water') || desc.includes('internet') || desc.includes('phone')) {
      return 'Utilities'
    } else if (desc.includes('health') || desc.includes('medical') || desc.includes('doctor') || desc.includes('pharmacy')) {
      return 'Healthcare'
    } else if (desc.includes('entertainment') || desc.includes('movie') || desc.includes('game') || desc.includes('subscription')) {
      return 'Entertainment'
    } else if (desc.includes('shopping') || desc.includes('clothes') || desc.includes('fashion')) {
      return 'Shopping'
    } else {
      return 'Other'
    }
  }

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="text-center py-8">
          <div className="p-4 bg-gray-50 rounded-xl mb-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No expense data available</p>
          <p className="text-gray-400 text-sm">Add some expenses to see spending categories</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  )
}

export default SpendingCategoriesChart
