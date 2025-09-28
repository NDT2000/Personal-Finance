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


app.listen(PORT, () => {
  console.log(`Database API server running on http://localhost:${PORT}`)
})
