// Script to update database schema for ML features
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'personal_finance',
  port: process.env.DB_PORT || 3306
}

async function updateDatabaseForML() {
  let connection
  
  try {
    connection = await mysql.createConnection(dbConfig)
    console.log('🔗 Connected to database')
    
    // Add ML columns to transactions table
    console.log('📊 Adding ML columns to transactions table...')
    const addMLColumns = `
      ALTER TABLE transactions 
      ADD COLUMN IF NOT EXISTS ml_category VARCHAR(50),
      ADD COLUMN IF NOT EXISTS ml_confidence DECIMAL(3,2),
      ADD COLUMN IF NOT EXISTS is_ml_predicted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS manual_override BOOLEAN DEFAULT FALSE
    `
    
    await connection.execute(addMLColumns)
    console.log('✅ ML columns added to transactions table')
    
    // Create ML training data table
    console.log('📚 Creating ml_training_data table...')
    const createMLTrainingTable = `
      CREATE TABLE IF NOT EXISTS ml_training_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        merchant_name VARCHAR(255),
        amount DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        INDEX idx_category (category),
        INDEX idx_created_at (created_at)
      )
    `
    
    await connection.execute(createMLTrainingTable)
    console.log('✅ ml_training_data table created successfully')
    
    // Create ML model metadata table
    console.log('🤖 Creating ml_models table...')
    const createMLModelsTable = `
      CREATE TABLE IF NOT EXISTS ml_models (
        id INT AUTO_INCREMENT PRIMARY KEY,
        model_name VARCHAR(100) NOT NULL,
        version VARCHAR(20) NOT NULL,
        accuracy DECIMAL(5,4),
        training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        model_path VARCHAR(255),
        training_data_size INT DEFAULT 0,
        INDEX idx_model_name (model_name),
        INDEX idx_is_active (is_active)
      )
    `
    
    await connection.execute(createMLModelsTable)
    console.log('✅ ml_models table created successfully')
    
    // Insert initial model record
    console.log('📝 Inserting initial model record...')
    const insertModel = `
      INSERT INTO ml_models (model_name, version, accuracy, is_active, training_data_size) 
      VALUES ('expense_categorizer_v1', '1.0.0', 0.85, TRUE, 50)
      ON DUPLICATE KEY UPDATE 
      version = VALUES(version),
      accuracy = VALUES(accuracy),
      is_active = VALUES(is_active)
    `
    
    await connection.execute(insertModel)
    console.log('✅ Initial model record inserted')
    
    // Insert sample training data
    console.log('📊 Inserting sample training data...')
    const trainingData = [
      ['Monthly rent payment', 'housing', 'Landlord', 1200.00, true],
      ['Grocery shopping at Walmart', 'food', 'Walmart', 85.50, true],
      ['Gas station fill up', 'transportation', 'Shell', 45.00, true],
      ['Electric bill payment', 'utilities', 'Electric Company', 120.00, true],
      ['Doctor visit', 'healthcare', 'Medical Center', 150.00, true],
      ['Netflix subscription', 'entertainment', 'Netflix', 15.99, true],
      ['Amazon purchase', 'shopping', 'Amazon', 75.00, true],
      ['Coffee at Starbucks', 'food', 'Starbucks', 4.50, true],
      ['Uber ride', 'transportation', 'Uber', 12.00, true],
      ['Movie tickets', 'entertainment', 'AMC Theater', 25.00, true]
    ]
    
    const insertTrainingData = `
      INSERT INTO ml_training_data (description, category, merchant_name, amount, is_verified) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      description = VALUES(description),
      category = VALUES(category)
    `
    
    for (const data of trainingData) {
      await connection.execute(insertTrainingData, data)
    }
    
    console.log('✅ Sample training data inserted')
    
    // Verify the changes
    console.log('🔍 Verifying database changes...')
    
    // Check transactions table structure
    const [transactionColumns] = await connection.execute(
      "SHOW COLUMNS FROM transactions LIKE 'ml_%'"
    )
    console.log(`✅ Found ${transactionColumns.length} ML columns in transactions table`)
    
    // Check training data count
    const [trainingCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM ml_training_data'
    )
    console.log(`✅ Training data count: ${trainingCount[0].count}`)
    
    // Check model record
    const [modelRecord] = await connection.execute(
      'SELECT * FROM ml_models WHERE is_active = TRUE'
    )
    console.log(`✅ Active model: ${modelRecord[0]?.model_name} v${modelRecord[0]?.version}`)
    
    console.log('🎉 Database successfully updated for ML features!')
    
  } catch (error) {
    console.error('❌ Error updating database:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the update if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateDatabaseForML()
    .then(() => {
      console.log('✅ Database update completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Database update failed:', error)
      process.exit(1)
    })
}

export default updateDatabaseForML
