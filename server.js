// Simple Express server for database operations
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())


// Database configuration (working config from our test)
const dbConfig = {
  host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: 'oY2J5H4GXp8Ek8Y.root',
  password: 'r517k29CCCRWzOK2',
  database: 'Finance',
  ssl: {
    rejectUnauthorized: false
  }
}

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test')
    
    // Check database
    const [dbRows] = await connection.execute('SELECT DATABASE() as current_db')
    
    // Check tables
    const [tableRows] = await connection.execute('SHOW TABLES')
    
    // Check users count
    const [userRows] = await connection.execute('SELECT COUNT(*) as count FROM users')
    
    await connection.end()
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        database: dbRows[0].current_db,
        tables: tableRows,
        userCount: userRows[0].count
      }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Sync user to database
app.post('/api/sync-user', async (req, res) => {
  try {
    const { userData } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    )
    
    if (existingUsers.length > 0) {
      await connection.end()
      return res.json({
        success: true,
        message: 'User already exists in database'
      })
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12)
    
    // Insert user
    const [result] = await connection.execute(
      'INSERT INTO users (first_name, last_name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        passwordHash,
        new Date(userData.createdAt).toISOString()
      ]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      message: 'User synced to database',
      userId: result.insertId
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Authenticate user
app.post('/api/auth', async (req, res) => {
  try {
    const { email, password } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    // Find user
    const [users] = await connection.execute(
      'SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      await connection.end()
      return res.json({
        success: false,
        message: 'Invalid email or password'
      })
    }
    
    const user = users[0]
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isPasswordValid) {
      await connection.end()
      return res.json({
        success: false,
        message: 'Invalid email or password'
      })
    }
    
    await connection.end()
    
    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    const [users] = await connection.execute(
      'SELECT id, first_name, last_name, email, created_at FROM users ORDER BY created_at DESC'
    )
    
    await connection.end()
    
    res.json({
      success: true,
      users: users
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get user accounts
app.get('/api/accounts/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    const [accounts] = await connection.execute(
      'SELECT id, account_type, account_name, balance, created_at FROM accounts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      accounts: accounts
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Create new account
app.post('/api/accounts', async (req, res) => {
  try {
    const { userId, accountType, accountName, initialBalance = 0 } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await connection.execute(
      'INSERT INTO accounts (user_id, account_type, account_name, balance) VALUES (?, ?, ?, ?)',
      [userId, accountType, accountName, initialBalance]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      accountId: result.insertId,
      message: 'Account created successfully'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get transactions for an account
app.get('/api/transactions/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    const [transactions] = await connection.execute(
      'SELECT id, amount, category, transaction_type, description, transaction_date, created_at FROM transactions WHERE account_id = ? ORDER BY transaction_date DESC, created_at DESC',
      [accountId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      transactions: transactions
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Create new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { accountId, amount, category, transactionType, description, transactionDate } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    // Start transaction
    await connection.beginTransaction()
    
    try {
      // Insert transaction
      const [result] = await connection.execute(
        'INSERT INTO transactions (account_id, amount, category, transaction_type, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
        [accountId, amount, category, transactionType, description, transactionDate]
      )
      
      // Update account balance
      const balanceChange = transactionType === 'income' ? amount : -amount
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [balanceChange, accountId]
      )
      
      await connection.commit()
      
      res.json({
        success: true,
        transactionId: result.insertId,
        message: 'Transaction created successfully'
      })
      
    } catch (error) {
      await connection.rollback()
      throw error
    }
    
    await connection.end()
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Delete transaction
app.delete('/api/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    // Start transaction
    await connection.beginTransaction()
    
    try {
      // Get transaction details
      const [transactions] = await connection.execute(
        'SELECT account_id, amount, transaction_type FROM transactions WHERE id = ?',
        [transactionId]
      )
      
      if (transactions.length === 0) {
        await connection.rollback()
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        })
      }
      
      const transaction = transactions[0]
      
      // Delete transaction
      await connection.execute(
        'DELETE FROM transactions WHERE id = ?',
        [transactionId]
      )
      
      // Update account balance (reverse the transaction)
      const balanceChange = transaction.transaction_type === 'income' ? -transaction.amount : transaction.amount
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [balanceChange, transaction.account_id]
      )
      
      await connection.commit()
      
      res.json({
        success: true,
        message: 'Transaction deleted successfully'
      })
      
    } catch (error) {
      await connection.rollback()
      throw error
    }
    
    await connection.end()
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get user dashboard data
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    // Get all accounts for user
    const [accounts] = await connection.execute(
      'SELECT id, account_type, account_name, balance FROM accounts WHERE user_id = ?',
      [userId]
    )
    
    // Get all transactions for user (across all accounts)
    const [transactions] = await connection.execute(
      `SELECT t.id, t.amount, t.category, t.transaction_type, t.description, t.transaction_date, a.account_name
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = ?
       ORDER BY t.transaction_date DESC, t.created_at DESC`,
      [userId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      accounts: accounts,
      transactions: transactions
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ML Categorization endpoints
app.post('/api/ml/categorize', async (req, res) => {
  try {
    const { descriptions } = req.body;
    
    // Import ML service
    const { default: mlService } = await import('./src/services/mlService.js');
    
    const predictions = mlService.predictBatch(descriptions);
    
    res.json({
      success: true,
      predictions: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get ML model info
app.get('/api/ml/info', async (req, res) => {
  try {
    const { default: mlService } = await import('./src/services/mlService.js');
    const info = mlService.getModelInfo();
    
    res.json({
      success: true,
      model: info
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update transaction with ML prediction
app.put('/api/transactions/:transactionId/ml', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { mlCategory, mlConfidence, isMLPredicted } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE transactions SET ml_category = ?, ml_confidence = ?, is_ml_predicted = ? WHERE id = ?',
      [mlCategory, mlConfidence, isMLPredicted, transactionId]
    );
    
    await connection.end();
    
    res.json({
      success: true,
      message: 'ML prediction updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get transactions needing manual review
app.get('/api/ml/review', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [transactions] = await connection.execute(
      `SELECT t.id, t.description, t.amount, t.ml_category, t.ml_confidence, t.transaction_date, a.account_name
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.ml_confidence < 0.7 AND t.is_ml_predicted = TRUE
       ORDER BY t.transaction_date DESC
       LIMIT 50`
    );
    
    await connection.end();
    
    res.json({
      success: true,
      transactions: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test ML model endpoint
app.get('/api/ml/test', async (req, res) => {
  try {
    const { default: mlService } = await import('./src/services/mlService.js');
    const testResults = mlService.testModel();
    
    res.json({
      success: true,
      testResults: testResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API server is running',
    timestamp: new Date().toISOString()
  })
})

// Get user by email
app.get('/api/user-by-email/:email', async (req, res) => {
  try {
    const { email } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    const [users] = await connection.execute(
      'SELECT id, first_name, last_name, email FROM users WHERE email = ?',
      [email]
    )
    
    await connection.end()
    
    if (users.length > 0) {
      res.json({
        success: true,
        user: users[0]
      })
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    // Check if user exists
    const [users] = await connection.execute(
      'SELECT id, first_name, email FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      await connection.end()
      return res.json({
        success: false,
        message: 'No account found with that email address'
      })
    }
    
    const user = users[0]
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Store reset token in database
    await connection.execute(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?',
      [user.id, resetToken, tokenExpiry, resetToken, tokenExpiry]
    )
    
    await connection.end()
    
    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`
    console.log(`Password reset link for ${email}: ${resetUrl}`)
    
    res.json({
      success: true,
      message: 'Password reset instructions have been sent to your email address'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Reset password endpoint
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    // Find valid reset token
    const [tokens] = await connection.execute(
      'SELECT prt.user_id, u.email FROM password_reset_tokens prt JOIN users u ON prt.user_id = u.id WHERE prt.token = ? AND prt.expires_at > NOW()',
      [token]
    )
    
    if (tokens.length === 0) {
      await connection.end()
      return res.json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }
    
    const resetData = tokens[0]
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12)
    
    // Update user password
    await connection.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, resetData.user_id]
    )
    
    // Delete used reset token
    await connection.execute(
      'DELETE FROM password_reset_tokens WHERE token = ?',
      [token]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      message: 'Password has been reset successfully'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ==================== GOALS API ENDPOINTS ====================

// Get user's goals
app.get('/api/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    const [goals] = await connection.execute(
      `SELECT id, goal_type, title, description, target_amount, current_amount, deadline, priority, status, created_at, updated_at,
       CASE 
         WHEN deadline IS NULL THEN NULL
         WHEN deadline < CURDATE() THEN 'overdue'
         WHEN deadline <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'due_soon'
         ELSE 'on_track'
       END as deadline_status,
       CASE 
         WHEN target_amount = 0 THEN 0
         ELSE ROUND((current_amount / target_amount) * 100, 2)
       END as progress_percentage
       FROM goals 
       WHERE user_id = ? 
       ORDER BY priority DESC, deadline ASC, created_at DESC`,
      [userId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      goals: goals
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Create new goal
app.post('/api/goals', async (req, res) => {
  try {
    const { userId, goalType, title, description, targetAmount, deadline, priority = 'medium' } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    const [result] = await connection.execute(
      'INSERT INTO goals (user_id, goal_type, title, description, target_amount, deadline, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, goalType, title, description, targetAmount, deadline, priority]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      goalId: result.insertId,
      message: 'Goal created successfully'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Update goal
app.put('/api/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params
    const { title, description, targetAmount, deadline, priority, status } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    const updateFields = []
    const updateValues = []
    
    if (title !== undefined) {
      updateFields.push('title = ?')
      updateValues.push(title)
    }
    if (description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(description)
    }
    if (targetAmount !== undefined) {
      updateFields.push('target_amount = ?')
      updateValues.push(targetAmount)
    }
    if (deadline !== undefined) {
      updateFields.push('deadline = ?')
      updateValues.push(deadline)
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?')
      updateValues.push(priority)
    }
    if (status !== undefined) {
      updateFields.push('status = ?')
      updateValues.push(status)
    }
    
    if (updateFields.length === 0) {
      await connection.end()
      return res.json({
        success: false,
        error: 'No fields to update'
      })
    }
    
    updateValues.push(goalId)
    
    await connection.execute(
      `UPDATE goals SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )
    
    await connection.end()
    
    res.json({
      success: true,
      message: 'Goal updated successfully'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Delete goal
app.delete('/api/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    await connection.execute(
      'DELETE FROM goals WHERE id = ?',
      [goalId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      message: 'Goal deleted successfully'
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Add transaction to goal
app.post('/api/goals/:goalId/transactions', async (req, res) => {
  try {
    const { goalId } = req.params
    const { amount, transactionType = 'contribution', transactionDate, description } = req.body
    const connection = await mysql.createConnection(dbConfig)
    
    // Start transaction
    await connection.beginTransaction()
    
    try {
      // Add goal transaction
      const [result] = await connection.execute(
        'INSERT INTO goal_transactions (goal_id, amount, transaction_type, transaction_date, description) VALUES (?, ?, ?, ?, ?)',
        [goalId, amount, transactionType, transactionDate, description]
      )
      
      // Update goal current amount
      const balanceChange = transactionType === 'contribution' ? amount : -amount
      await connection.execute(
        'UPDATE goals SET current_amount = current_amount + ? WHERE id = ?',
        [balanceChange, goalId]
      )
      
      // Record progress
      const [goalData] = await connection.execute(
        'SELECT target_amount, current_amount FROM goals WHERE id = ?',
        [goalId]
      )
      
      if (goalData.length > 0) {
        const goal = goalData[0]
        const progressPercentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
        
        await connection.execute(
          'INSERT INTO goal_progress (goal_id, progress_amount, progress_percentage, recorded_date) VALUES (?, ?, ?, ?)',
          [goalId, goal.current_amount, progressPercentage, transactionDate]
        )
      }
      
      await connection.commit()
      
      res.json({
        success: true,
        transactionId: result.insertId,
        message: 'Goal transaction added successfully'
      })
      
    } catch (error) {
      await connection.rollback()
      throw error
    }
    
    await connection.end()
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get goal transactions
app.get('/api/goals/:goalId/transactions', async (req, res) => {
  try {
    const { goalId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    const [transactions] = await connection.execute(
      'SELECT id, amount, transaction_type, transaction_date, description, created_at FROM goal_transactions WHERE goal_id = ? ORDER BY transaction_date DESC, created_at DESC',
      [goalId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      transactions: transactions
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get goal progress timeline
app.get('/api/goals/:goalId/progress', async (req, res) => {
  try {
    const { goalId } = req.params
    const connection = await mysql.createConnection(dbConfig)
    
    const [progress] = await connection.execute(
      'SELECT progress_amount, progress_percentage, recorded_date FROM goal_progress WHERE goal_id = ? ORDER BY recorded_date ASC',
      [goalId]
    )
    
    await connection.end()
    
    res.json({
      success: true,
      progress: progress
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})


app.listen(PORT, () => {
  console.log(`Database API server running on http://localhost:${PORT}`)
})
