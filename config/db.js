const { Sequelize } = require('sequelize');
require('dotenv').config();

// Validate environment variables
if (!process.env.DB_NAME || !process.env.DB_USER) {
  console.error('Missing required database environment variables!');
  console.error('Please check your .env file has: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  }
);

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MySQL...');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`Port: ${process.env.DB_PORT || 3306}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`User: ${process.env.DB_USER}`);
    
    await sequelize.authenticate();
    console.log('✓ MySQL connected successfully');
    
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database synchronized');
  } catch (error) {
    console.error('✗ Database connection error:');
    console.error('Error:', error.message);
    
    if (error.original) {
      console.error('Details:', error.original.message);
      
      if (error.original.code === 'ECONNREFUSED') {
        console.error('\nMySQL server is not running or not accessible.');
        console.error('Solutions:');
        console.error('1. Start MySQL service (XAMPP/WAMP control panel)');
        console.error('2. Check if MySQL is running: mysql -u root -p');
        console.error('3. Verify DB_HOST and DB_PORT in .env file');
      } else if (error.original.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('\nAccess denied - Invalid credentials.');
        console.error('Solutions:');
        console.error('1. Check DB_USER and DB_PASSWORD in .env file');
        console.error('2. Verify MySQL user has proper permissions');
      } else if (error.original.code === 'ER_BAD_DB_ERROR') {
        console.error('\nDatabase does not exist.');
        console.error('Solutions:');
        console.error('1. Create database: CREATE DATABASE oneflow_db;');
        console.error('2. Or run: mysql -u root -p -e "CREATE DATABASE oneflow_db;"');
      }
    }
    
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
