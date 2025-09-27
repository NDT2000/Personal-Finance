// Simple Express server for database operations
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

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

app.listen(PORT, () => {
  console.log(`Database API server running on http://localhost:${PORT}`)
})
