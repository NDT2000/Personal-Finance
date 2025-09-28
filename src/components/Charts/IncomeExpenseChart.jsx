import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const IncomeExpenseChart = ({ transactions }) => {
  // Calculate monthly data
  const monthlyData = {}
  
  transactions.forEach(transaction => {
    const month = new Date(transaction.transaction_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 }
    }
    
    if (transaction.transaction_type === 'income') {
      monthlyData[month].income += transaction.amount
    } else {
      monthlyData[month].expense += Math.abs(transaction.amount)
    }
  })

  const months = Object.keys(monthlyData).sort()
  const incomeData = months.map(month => monthlyData[month].income)
  const expenseData = months.map(month => monthlyData[month].expense)

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
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
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          color: '#6B7280',
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default IncomeExpenseChart
