// Script to create all database tables for the personal finance application
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

async function createDatabaseTables() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    // Create users table (if not exists)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        preferences JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `
    
    await connection.execute(createUsersTable)
    console.log('✅ users table created successfully')
    
    // Create accounts table
    const createAccountsTable = `
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        account_type ENUM('checking', 'savings', 'credit', 'investment', 'cash') NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_account_type (account_type)
      )
    `
    
    await connection.execute(createAccountsTable)
    console.log('✅ accounts table created successfully')
    
    // Create transactions table
    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        transaction_type ENUM('income', 'expense', 'transfer') NOT NULL,
        description TEXT,
        transaction_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        INDEX idx_account_id (account_id),
        INDEX idx_transaction_type (transaction_type),
        INDEX idx_category (category),
        INDEX idx_transaction_date (transaction_date)
      )
    `
    
    await connection.execute(createTransactionsTable)
    console.log('✅ transactions table created successfully')
    
    // Create password_reset_tokens table (if not exists)
    const createResetTokensTable = `
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
    
    await connection.execute(createResetTokensTable)
    console.log('✅ password_reset_tokens table created successfully')
    
    await connection.end()
    console.log('🎉 All database tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating database tables:', error)
  }
}

createDatabaseTables()
