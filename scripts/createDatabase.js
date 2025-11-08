const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    console.log('Connecting to MySQL server...');
    
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✓ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'oneflow_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Database '${dbName}' created or already exists`);

    await connection.end();
    console.log('\n✓ Setup complete! You can now run: npm start');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nMySQL server is not running!');
      console.error('Please start MySQL from XAMPP/WAMP control panel');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nInvalid MySQL credentials!');
      console.error('Check DB_USER and DB_PASSWORD in your .env file');
    }
    
    process.exit(1);
  }
}

createDatabase();
