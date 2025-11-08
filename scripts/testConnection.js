const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MySQL connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}`);
  console.log(`  Database: ${process.env.DB_NAME || 'oneflow_db'}\n`);

  try {
    // Test connection to MySQL server
    console.log('Step 1: Connecting to MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    console.log('✓ MySQL server connection successful!\n');

    // Check if database exists
    console.log('Step 2: Checking if database exists...');
    const dbName = process.env.DB_NAME || 'oneflow_db';
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === dbName);
    
    if (dbExists) {
      console.log(`✓ Database '${dbName}' exists!\n`);
    } else {
      console.log(`✗ Database '${dbName}' does NOT exist!`);
      console.log(`  Run: npm run setup-db\n`);
    }

    await connection.end();
    
    console.log('✓ All checks passed!');
    console.log('\nYou can now run: npm start');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    console.log('\n--- Troubleshooting ---');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('MySQL server is not running!');
      console.log('\nSolutions:');
      console.log('1. Start XAMPP/WAMP and start MySQL service');
      console.log('2. Or start MySQL from Windows Services');
      console.log('3. Check if port 3306 is correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('Invalid username or password!');
      console.log('\nSolutions:');
      console.log('1. Check DB_USER in .env (usually "root")');
      console.log('2. Check DB_PASSWORD in .env');
      console.log('3. Try empty password if using XAMPP default');
    } else if (error.code === 'ENOTFOUND') {
      console.log('Cannot find MySQL host!');
      console.log('\nSolutions:');
      console.log('1. Check DB_HOST in .env (should be "localhost" or "127.0.0.1")');
    }
    
    process.exit(1);
  }
}

testConnection();
