const { sequelize } = require('../config/db');

async function addTaskFields() {
  try {
    console.log('Adding new fields to Tasks table...');

    // Check and add loggedHours column
    try {
      await sequelize.query(`
        ALTER TABLE Tasks 
        ADD COLUMN loggedHours DECIMAL(10, 2) DEFAULT 0 
        COMMENT 'Total hours logged for this task'
      `);
      console.log('✓ Added loggedHours column');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ loggedHours column already exists');
      } else {
        throw error;
      }
    }

    // Check and add payPerHour column
    try {
      await sequelize.query(`
        ALTER TABLE Tasks 
        ADD COLUMN payPerHour DECIMAL(10, 2) DEFAULT 0 
        COMMENT 'Pay rate per hour for this task'
      `);
      console.log('✓ Added payPerHour column');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ payPerHour column already exists');
      } else {
        throw error;
      }
    }

    // Check and add estimatedHours column
    try {
      await sequelize.query(`
        ALTER TABLE Tasks 
        ADD COLUMN estimatedHours DECIMAL(10, 2) DEFAULT 0 
        COMMENT 'Estimated hours to complete'
      `);
      console.log('✓ Added estimatedHours column');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ estimatedHours column already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  }
}

addTaskFields();
