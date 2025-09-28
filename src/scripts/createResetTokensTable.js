// Script to create password_reset_tokens table
import mysql from 'mysql2/promise'

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

async function createResetTokensTable() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    // Create password_reset_tokens table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires_at (expires_at)
      )
    `
    
    await connection.execute(createTableQuery)
    console.log('✅ password_reset_tokens table created successfully')
    
    await connection.end()
    
  } catch (error) {
    console.error('❌ Error creating password_reset_tokens table:', error)
  }
}

createResetTokensTable()
