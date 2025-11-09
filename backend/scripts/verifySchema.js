const mysql = require('mysql2/promise');
const { sequelize } = require('../config/db');
const models = require('../models');
require('dotenv').config();

// Expected schema definitions
const expectedSchemas = {
  Users: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      name: { type: 'varchar', nullable: false },
      email: { type: 'varchar', nullable: false, unique: true },
      password: { type: 'varchar', nullable: true },
      role: { type: 'enum', nullable: false, values: ['admin', 'project_manager', 'team_member', 'sales_finance'] },
      isEmailVerified: { type: 'tinyint', nullable: false, defaultValue: 0 },
      emailVerificationOTP: { type: 'varchar', nullable: true },
      otpExpiry: { type: 'datetime', nullable: true },
      googleId: { type: 'varchar', nullable: true, unique: true },
      authProvider: { type: 'enum', nullable: false, values: ['local', 'google'], defaultValue: 'local' },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  Projects: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      title: { type: 'varchar', nullable: false },
      description: { type: 'text', nullable: true },
      startDate: { type: 'datetime', nullable: true },
      endDate: { type: 'datetime', nullable: true },
      managerId: { type: 'int', nullable: false, foreignKey: 'Users.id' },
      status: { type: 'enum', nullable: false, values: ['planning', 'active', 'on_hold', 'completed', 'cancelled'] },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  Tasks: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      title: { type: 'varchar', nullable: false },
      description: { type: 'text', nullable: true },
      assignedTo: { type: 'int', nullable: true, foreignKey: 'Users.id' },
      projectId: { type: 'int', nullable: false, foreignKey: 'Projects.id' },
      status: { type: 'enum', nullable: false, values: ['todo', 'in_progress', 'review', 'completed', 'active'] },
      dueDate: { type: 'datetime', nullable: true },
      assignedBy: { type: 'int', nullable: true, foreignKey: 'Users.id' },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  Timesheets: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      userId: { type: 'int', nullable: false, foreignKey: 'Users.id' },
      projectId: { type: 'int', nullable: false, foreignKey: 'Projects.id' },
      date: { type: 'date', nullable: false },
      hoursWorked: { type: 'decimal', nullable: false, precision: '5,2' },
      description: { type: 'text', nullable: true },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  Expenses: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      userId: { type: 'int', nullable: false, foreignKey: 'Users.id' },
      projectId: { type: 'int', nullable: false, foreignKey: 'Projects.id' },
      amount: { type: 'decimal', nullable: false, precision: '10,2' },
      description: { type: 'text', nullable: true },
      status: { type: 'enum', nullable: false, values: ['pending', 'approved', 'rejected'] },
      approvedByPm: { type: 'tinyint', nullable: false, defaultValue: 0 },
      type: { type: 'enum', nullable: false, values: ['expense', 'sales_order', 'purchase_order', 'invoice', 'bill'] },
      referenceId: { type: 'int', nullable: true },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  SalesOrders: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      referenceNo: { type: 'varchar', nullable: false, unique: true },
      date: { type: 'date', nullable: false },
      customerName: { type: 'varchar', nullable: false },
      totalAmount: { type: 'decimal', nullable: false, precision: '10,2' },
      status: { type: 'enum', nullable: false, values: ['draft', 'confirmed', 'delivered', 'cancelled'] },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  PurchaseOrders: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      referenceNo: { type: 'varchar', nullable: false, unique: true },
      date: { type: 'date', nullable: false },
      supplierName: { type: 'varchar', nullable: false },
      totalAmount: { type: 'decimal', nullable: false, precision: '10,2' },
      status: { type: 'enum', nullable: false, values: ['draft', 'sent', 'received', 'cancelled'] },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  Invoices: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      referenceNo: { type: 'varchar', nullable: false, unique: true },
      date: { type: 'date', nullable: false },
      customerName: { type: 'varchar', nullable: false },
      totalAmount: { type: 'decimal', nullable: false, precision: '10,2' },
      status: { type: 'enum', nullable: false, values: ['draft', 'sent', 'paid', 'overdue', 'cancelled'] },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  },
  Bills: {
    columns: {
      id: { type: 'int', nullable: false, primary: true, autoIncrement: true },
      referenceNo: { type: 'varchar', nullable: false, unique: true },
      date: { type: 'date', nullable: false },
      supplierName: { type: 'varchar', nullable: false },
      totalAmount: { type: 'decimal', nullable: false, precision: '10,2' },
      status: { type: 'enum', nullable: false, values: ['draft', 'received', 'paid', 'overdue'] },
      createdAt: { type: 'datetime', nullable: false },
      updatedAt: { type: 'datetime', nullable: false }
    }
  }
};

// Helper function to normalize column type
function normalizeType(type, length = null) {
  type = type.toLowerCase();
  if (type.includes('int')) return 'int';
  if (type.includes('varchar')) return 'varchar';
  if (type.includes('text')) return 'text';
  if (type.includes('datetime')) return 'datetime';
  if (type.includes('date') && !type.includes('datetime')) return 'date';
  if (type.includes('decimal')) return 'decimal';
  if (type.includes('enum')) return 'enum';
  if (type.includes('tinyint')) return 'tinyint';
  return type;
}

// Helper function to check if types match
function typesMatch(expected, actual, length) {
  const normalizedExpected = expected.toLowerCase();
  const normalizedActual = normalizeType(actual, length);
  
  if (normalizedExpected === 'int' && normalizedActual === 'int') return true;
  if (normalizedExpected === 'varchar' && normalizedActual === 'varchar') return true;
  if (normalizedExpected === 'text' && normalizedActual === 'text') return true;
  if (normalizedExpected === 'datetime' && normalizedActual === 'datetime') return true;
  if (normalizedExpected === 'date' && normalizedActual === 'date') return true;
  if (normalizedExpected === 'decimal' && normalizedActual === 'decimal') return true;
  if (normalizedExpected === 'enum' && normalizedActual === 'enum') return true;
  if (normalizedExpected === 'tinyint' && normalizedActual === 'tinyint') return true;
  
  return false;
}

async function verifySchema() {
  const results = {
    passed: true,
    errors: [],
    warnings: [],
    tables: {}
  };

  try {
    console.log('🔍 Starting database schema verification...\n');
    console.log(`Database: ${process.env.DB_NAME || 'oneflow_db'}`);
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`Port: ${process.env.DB_PORT || 3306}\n`);

    // Test connection
    console.log('Step 1: Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful\n');

    // Get all tables
    console.log('Step 2: Checking tables...');
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);

    // Check if all expected tables exist (case-insensitive comparison)
    const expectedTables = Object.keys(expectedSchemas);
    const tableNamesLower = tableNames.map(t => t.toLowerCase());
    const expectedTablesLower = expectedTables.map(t => t.toLowerCase());
    
    const missingTables = expectedTables.filter((table, idx) => !tableNamesLower.includes(expectedTablesLower[idx]));
    const extraTables = tableNames.filter(table => !expectedTablesLower.includes(table.toLowerCase()));

    if (missingTables.length > 0) {
      results.passed = false;
      results.errors.push(`Missing tables: ${missingTables.join(', ')}`);
      console.log(`✗ Missing tables: ${missingTables.join(', ')}`);
    } else {
      console.log(`✓ All ${expectedTables.length} tables exist`);
    }

    if (extraTables.length > 0) {
      results.warnings.push(`Extra tables found: ${extraTables.join(', ')}`);
      console.log(`⚠ Extra tables: ${extraTables.join(', ')}`);
    }

    console.log('');

    // Verify each table's structure
    for (const tableName of expectedTables) {
      // Find actual table name (case-insensitive)
      const actualTableName = tableNames.find(t => t.toLowerCase() === tableName.toLowerCase());
      if (!actualTableName) {
        results.tables[tableName] = { exists: false, errors: ['Table does not exist'] };
        continue;
      }

      console.log(`Step 3: Verifying table structure for '${tableName}'...`);
      const tableResults = {
        exists: true,
        columns: {},
        foreignKeys: {},
        indexes: {},
        errors: [],
        warnings: []
      };

      // Get table structure (use actual table name from database)
      const [columns] = await sequelize.query(`DESCRIBE \`${actualTableName}\``);
      const expectedColumns = expectedSchemas[tableName].columns;

      // Check columns
      const columnMap = {};
      columns.forEach(col => {
        columnMap[col.Field] = col;
      });

      for (const [colName, expectedCol] of Object.entries(expectedColumns)) {
        if (!columnMap[colName]) {
          tableResults.errors.push(`Missing column: ${colName}`);
          results.errors.push(`Table '${tableName}': Missing column '${colName}'`);
          continue;
        }

        const actualCol = columnMap[colName];
        const colResults = {
          exists: true,
          type: false,
          nullable: false,
          primary: false,
          autoIncrement: false,
          unique: false
        };

        // Check type
        if (!typesMatch(expectedCol.type, actualCol.Type)) {
          colResults.type = false;
          tableResults.errors.push(`Column '${colName}': Type mismatch (expected ${expectedCol.type}, got ${actualCol.Type})`);
        } else {
          colResults.type = true;
        }

        // Check nullable
        const isNullable = actualCol.Null === 'YES';
        if (expectedCol.nullable !== isNullable) {
          tableResults.errors.push(`Column '${colName}': Nullable mismatch (expected ${expectedCol.nullable}, got ${isNullable})`);
        } else {
          colResults.nullable = true;
        }

        // Check primary key
        const isPrimary = actualCol.Key === 'PRI';
        if (expectedCol.primary && !isPrimary) {
          tableResults.errors.push(`Column '${colName}': Should be primary key but is not`);
        } else if (!expectedCol.primary && isPrimary) {
          tableResults.warnings.push(`Column '${colName}': Is primary key but should not be`);
        } else {
          colResults.primary = isPrimary;
        }

        // Check auto increment
        const isAutoIncrement = actualCol.Extra.includes('auto_increment');
        if (expectedCol.autoIncrement && !isAutoIncrement) {
          tableResults.errors.push(`Column '${colName}': Should be auto increment but is not`);
        } else {
          colResults.autoIncrement = isAutoIncrement;
        }

        // Check unique
        const isUnique = actualCol.Key === 'UNI' || actualCol.Key === 'PRI';
        if (expectedCol.unique && !isUnique) {
          tableResults.warnings.push(`Column '${colName}': Should be unique but is not`);
        } else {
          colResults.unique = isUnique;
        }

        tableResults.columns[colName] = colResults;
      }

      // Check for extra columns
      const expectedColNames = Object.keys(expectedColumns);
      const actualColNames = Object.keys(columnMap);
      const extraCols = actualColNames.filter(col => !expectedColNames.includes(col));
      if (extraCols.length > 0) {
        tableResults.warnings.push(`Extra columns: ${extraCols.join(', ')}`);
      }

      // Check foreign keys
      console.log(`  Checking foreign keys for '${tableName}'...`);
      const [foreignKeys] = await sequelize.query(`
        SELECT 
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = '${actualTableName}'
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `);

      for (const [colName, expectedCol] of Object.entries(expectedColumns)) {
        if (expectedCol.foreignKey) {
          const [refTable, refCol] = expectedCol.foreignKey.split('.');
          const fk = foreignKeys.find(fk => fk.COLUMN_NAME === colName);
          
          if (!fk) {
            tableResults.errors.push(`Missing foreign key on column '${colName}'`);
            results.errors.push(`Table '${tableName}': Missing foreign key on '${colName}' -> ${expectedCol.foreignKey}`);
          } else if (fk.REFERENCED_TABLE_NAME.toLowerCase() !== refTable.toLowerCase() || fk.REFERENCED_COLUMN_NAME !== refCol) {
            tableResults.errors.push(`Foreign key mismatch on '${colName}' (expected ${expectedCol.foreignKey}, got ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME})`);
            results.errors.push(`Table '${tableName}': Foreign key mismatch on '${colName}'`);
          } else {
            tableResults.foreignKeys[colName] = { exists: true, correct: true };
          }
        }
      }

      results.tables[tableName] = tableResults;

      if (tableResults.errors.length === 0 && tableResults.warnings.length === 0) {
        console.log(`  ✓ Table '${tableName}' structure is correct`);
      } else {
        if (tableResults.errors.length > 0) {
          console.log(`  ✗ Table '${tableName}' has ${tableResults.errors.length} error(s)`);
          tableResults.errors.forEach(err => console.log(`    - ${err}`));
          results.passed = false;
        }
        if (tableResults.warnings.length > 0) {
          console.log(`  ⚠ Table '${tableName}' has ${tableResults.warnings.length} warning(s)`);
          tableResults.warnings.forEach(warn => console.log(`    - ${warn}`));
        }
      }
      console.log('');
    }

    // Test associations by checking if Sequelize can resolve them
    console.log('Step 4: Testing model associations...');
    try {
      // Check if associations are defined (even if tables are empty)
      const userAssociations = Object.keys(models.User.associations || {});
      const projectAssociations = Object.keys(models.Project.associations || {});
      const taskAssociations = Object.keys(models.Task.associations || {});
      const timesheetAssociations = Object.keys(models.Timesheet.associations || {});
      const expenseAssociations = Object.keys(models.Expense.associations || {});

      // Expected associations
      const expectedUserAssocs = ['managedProjects', 'assignedTasks', 'timesheets', 'expenses'];
      const expectedProjectAssocs = ['manager', 'tasks', 'timesheets', 'expenses'];
      const expectedTaskAssocs = ['project', 'assignee'];
      const expectedTimesheetAssocs = ['user', 'project'];
      const expectedExpenseAssocs = ['user', 'project'];

      let assocErrors = 0;

      // Check User associations
      expectedUserAssocs.forEach(assoc => {
        if (!userAssociations.includes(assoc)) {
          results.errors.push(`User model: Missing association '${assoc}'`);
          assocErrors++;
        }
      });

      // Check Project associations
      expectedProjectAssocs.forEach(assoc => {
        if (!projectAssociations.includes(assoc)) {
          results.errors.push(`Project model: Missing association '${assoc}'`);
          assocErrors++;
        }
      });

      // Check Task associations
      expectedTaskAssocs.forEach(assoc => {
        if (!taskAssociations.includes(assoc)) {
          results.errors.push(`Task model: Missing association '${assoc}'`);
          assocErrors++;
        }
      });

      // Check Timesheet associations
      expectedTimesheetAssocs.forEach(assoc => {
        if (!timesheetAssociations.includes(assoc)) {
          results.errors.push(`Timesheet model: Missing association '${assoc}'`);
          assocErrors++;
        }
      });

      // Check Expense associations
      expectedExpenseAssocs.forEach(assoc => {
        if (!expenseAssociations.includes(assoc)) {
          results.errors.push(`Expense model: Missing association '${assoc}'`);
          assocErrors++;
        }
      });

      if (assocErrors === 0) {
        console.log('✓ User -> Project association configured');
        console.log('✓ Project -> Task association configured');
        console.log('✓ Task associations configured');
        console.log('✓ Timesheet associations configured');
        console.log('✓ Expense associations configured');
        console.log('✓ All model associations are properly configured\n');
      } else {
        console.log(`✗ Found ${assocErrors} association error(s)\n`);
        results.passed = false;
      }

      // Try to query with associations (will work even if tables are empty)
      try {
        await models.User.findOne({ include: [{ model: models.Project, as: 'managedProjects', required: false }] });
        console.log('✓ Association queries are working\n');
      } catch (queryError) {
        console.log(`⚠ Association query test: ${queryError.message}\n`);
        results.warnings.push(`Association query test: ${queryError.message}`);
      }
    } catch (error) {
      console.log(`⚠ Association test error: ${error.message}\n`);
      results.errors.push(`Association test: ${error.message}`);
      results.passed = false;
    }

    // Summary
    console.log('='.repeat(60));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    
    if (results.passed && results.errors.length === 0) {
      console.log('✓ All schema verifications PASSED!');
      console.log(`✓ ${expectedTables.length} tables verified`);
      console.log('✓ All columns, foreign keys, and associations are correct');
      
      if (results.warnings.length > 0) {
        console.log(`\n⚠ ${results.warnings.length} warning(s) found (non-critical):`);
        results.warnings.forEach(warn => console.log(`  - ${warn}`));
      }
    } else {
      console.log('✗ Schema verification FAILED!');
      console.log(`✗ ${results.errors.length} error(s) found:`);
      results.errors.forEach(err => console.log(`  - ${err}`));
      
      if (results.warnings.length > 0) {
        console.log(`\n⚠ ${results.warnings.length} warning(s) found:`);
        results.warnings.forEach(warn => console.log(`  - ${warn}`));
      }
      
      console.log('\n💡 To fix issues, run: npm run sync-db');
    }
    
    console.log('='.repeat(60));

    await sequelize.close();
    process.exit(results.passed ? 0 : 1);

  } catch (error) {
    console.error('\n✗ Verification failed with error:');
    console.error(error.message);
    if (error.original) {
      console.error('Details:', error.original.message);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nMySQL server is not running!');
      console.error('Please start MySQL from XAMPP/WAMP control panel');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nInvalid MySQL credentials!');
      console.error('Check DB_USER and DB_PASSWORD in your .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\nDatabase does not exist!');
      console.error('Run: npm run setup-db');
    }
    
    await sequelize.close();
    process.exit(1);
  }
}

verifySchema();

