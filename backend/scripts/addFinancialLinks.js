const { sequelize } = require('../config/db');

async function addFinancialLinks() {
  try {
    console.log('Adding project links to financial tables...\n');

    // Add projectId to SalesOrders
    try {
      await sequelize.query(`
        ALTER TABLE SalesOrders 
        ADD COLUMN projectId INT,
        ADD COLUMN description TEXT
      `);
      console.log('✓ Added projectId and description to SalesOrders');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ SalesOrders columns already exist');
      } else {
        throw error;
      }
    }

    // Add projectId to PurchaseOrders
    try {
      await sequelize.query(`
        ALTER TABLE PurchaseOrders 
        ADD COLUMN projectId INT,
        ADD COLUMN description TEXT
      `);
      console.log('✓ Added projectId and description to PurchaseOrders');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ PurchaseOrders columns already exist');
      } else {
        throw error;
      }
    }

    // Add projectId and salesOrderId to Invoices
    try {
      await sequelize.query(`
        ALTER TABLE Invoices 
        ADD COLUMN projectId INT,
        ADD COLUMN salesOrderId INT,
        ADD COLUMN description TEXT
      `);
      console.log('✓ Added projectId, salesOrderId, and description to Invoices');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ Invoices columns already exist');
      } else {
        throw error;
      }
    }

    // Add projectId and purchaseOrderId to Bills
    try {
      await sequelize.query(`
        ALTER TABLE Bills 
        ADD COLUMN projectId INT,
        ADD COLUMN purchaseOrderId INT,
        ADD COLUMN description TEXT
      `);
      console.log('✓ Added projectId, purchaseOrderId, and description to Bills');
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('⚠ Bills columns already exist');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Financial links migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  }
}

addFinancialLinks();
