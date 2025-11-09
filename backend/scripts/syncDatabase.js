const { sequelize } = require('../config/db');
const models = require('../models');

async function syncDatabase() {
  try {
    console.log('Starting database synchronization...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    // Sync models one by one to avoid index limit
    console.log('\nSyncing models...');
    
    const modelList = [
      { name: 'User', model: models.User },
      { name: 'Project', model: models.Project },
      { name: 'Task', model: models.Task },
      { name: 'Timesheet', model: models.Timesheet },
      { name: 'Expense', model: models.Expense },
      { name: 'SalesOrder', model: models.SalesOrder },
      { name: 'PurchaseOrder', model: models.PurchaseOrder },
      { name: 'Invoice', model: models.Invoice },
      { name: 'Bill', model: models.Bill }
    ];

    for (const { name, model } of modelList) {
      try {
        await model.sync({ alter: false });
        console.log(`✓ ${name} synced`);
      } catch (error) {
        console.log(`⚠ ${name} already exists or error:`, error.message);
      }
    }

    console.log('\n✅ Database synchronization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error.message);
    process.exit(1);
  }
}

syncDatabase();
