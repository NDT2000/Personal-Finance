import mysql from 'mysql2/promise'

const createGoalsTables = async () => {
  let connection

  try {
    // Create database connection (using same config as server.js)
    connection = await mysql.createConnection({
      host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: 'oY2J5H4GXp8Ek8Y.root',
      password: 'r517k29CCCRWzOK2',
      database: 'Finance',
      ssl: {
        rejectUnauthorized: false
      }
    })

    console.log('Connected to database successfully')

    // Create goals table
    const createGoalsTable = `
      CREATE TABLE IF NOT EXISTS goals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        goal_type ENUM('savings', 'investment', 'debt_payoff', 'purchase', 'income') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_amount DECIMAL(15,2) NOT NULL,
        current_amount DECIMAL(15,2) DEFAULT 0.00,
        deadline DATE,
        priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
        status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_goal_type (goal_type)
      )
    `

    await connection.execute(createGoalsTable)
    console.log('✅ Goals table created successfully')

    // Create goal_transactions table
    const createGoalTransactionsTable = `
      CREATE TABLE IF NOT EXISTS goal_transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        goal_id INT NOT NULL,
        transaction_id INT,
        amount DECIMAL(15,2) NOT NULL,
        transaction_type ENUM('contribution', 'withdrawal', 'interest', 'dividend') DEFAULT 'contribution',
        transaction_date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
        INDEX idx_goal_id (goal_id),
        INDEX idx_transaction_date (transaction_date)
      )
    `

    await connection.execute(createGoalTransactionsTable)
    console.log('✅ Goal transactions table created successfully')

    // Create goal_progress table for tracking progress over time
    const createGoalProgressTable = `
      CREATE TABLE IF NOT EXISTS goal_progress (
        id INT PRIMARY KEY AUTO_INCREMENT,
        goal_id INT NOT NULL,
        progress_amount DECIMAL(15,2) NOT NULL,
        progress_percentage DECIMAL(5,2) NOT NULL,
        recorded_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
        INDEX idx_goal_id (goal_id),
        INDEX idx_recorded_date (recorded_date)
      )
    `

    await connection.execute(createGoalProgressTable)
    console.log('✅ Goal progress table created successfully')

    console.log('🎉 All goals-related tables created successfully!')

  } catch (error) {
    console.error('❌ Error creating goals tables:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the script
createGoalsTables()
  .then(() => {
    console.log('Goals tables creation completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed to create goals tables:', error)
    process.exit(1)
  })
