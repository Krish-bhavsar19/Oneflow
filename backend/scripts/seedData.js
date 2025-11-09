const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

async function seedData() {
  try {
    console.log('Starting data seeding...\n');

    // Create users
    console.log('Creating users...');
    const [adminResult] = await sequelize.query(`
      INSERT INTO Users (name, email, password, role, isEmailVerified, createdAt, updatedAt)
      VALUES 
        ('Admin User', 'admin@oneflow.com', '${await bcrypt.hash('admin123', 10)}', 'admin', 1, NOW(), NOW()),
        ('John Manager', 'pm@oneflow.com', '${await bcrypt.hash('pm123', 10)}', 'project_manager', 1, NOW(), NOW()),
        ('Alice Developer', 'alice@oneflow.com', '${await bcrypt.hash('alice123', 10)}', 'team_member', 1, NOW(), NOW()),
        ('Bob Designer', 'bob@oneflow.com', '${await bcrypt.hash('bob123', 10)}', 'team_member', 1, NOW(), NOW()),
        ('Sarah Finance', 'finance@oneflow.com', '${await bcrypt.hash('finance123', 10)}', 'sales_finance', 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE email=email
    `);
    console.log('✓ Users created');

    // Get user IDs
    const [users] = await sequelize.query('SELECT id, role FROM Users ORDER BY id');
    const admin = users.find(u => u.role === 'admin');
    const pm = users.find(u => u.role === 'project_manager');
    const teamMembers = users.filter(u => u.role === 'team_member');

    // Create projects
    console.log('Creating projects...');
    await sequelize.query(`
      INSERT INTO Projects (title, description, startDate, endDate, managerId, status, createdAt, updatedAt)
      VALUES 
        ('E-Commerce Website', 'Build a modern e-commerce platform with React and Node.js', '2025-01-01', '2025-06-30', ${pm.id}, 'active', NOW(), NOW()),
        ('Mobile App Development', 'Create iOS and Android app for customer engagement', '2025-02-01', '2025-08-31', ${pm.id}, 'planning', NOW(), NOW()),
        ('CRM System', 'Custom CRM solution for sales team', '2024-12-01', '2025-05-31', ${pm.id}, 'active', NOW(), NOW())
      ON DUPLICATE KEY UPDATE title=title
    `);
    console.log('✓ Projects created');

    // Get project IDs
    const [projects] = await sequelize.query('SELECT id FROM Projects ORDER BY id');

    // Create tasks
    console.log('Creating tasks...');
    if (teamMembers.length > 0) {
      await sequelize.query(`
        INSERT INTO Tasks (title, description, projectId, assignedTo, assignedBy, status, dueDate, estimatedHours, payPerHour, loggedHours, createdAt, updatedAt)
        VALUES 
          ('Setup Project Structure', 'Initialize project with proper folder structure', ${projects[0].id}, ${teamMembers[0].id}, ${pm.id}, 'completed', '2025-01-15', 8, 50, 8, NOW(), NOW()),
          ('Design Database Schema', 'Create ER diagram and database design', ${projects[0].id}, ${teamMembers[0].id}, ${pm.id}, 'completed', '2025-01-20', 16, 50, 14, NOW(), NOW()),
          ('Implement Authentication', 'Add user login and registration', ${projects[0].id}, ${teamMembers[0].id}, ${pm.id}, 'in_progress', '2025-01-30', 24, 50, 12, NOW(), NOW()),
          ('Create Product Catalog', 'Build product listing and details pages', ${projects[0].id}, ${teamMembers[1]?.id || teamMembers[0].id}, ${pm.id}, 'todo', '2025-02-15', 32, 45, 0, NOW(), NOW()),
          ('Payment Integration', 'Integrate payment gateway', ${projects[0].id}, ${teamMembers[0].id}, ${pm.id}, 'todo', '2025-03-01', 40, 50, 0, NOW(), NOW()),
          ('UI/UX Design', 'Create wireframes and mockups', ${projects[1].id}, ${teamMembers[1]?.id || teamMembers[0].id}, ${pm.id}, 'in_progress', '2025-02-20', 20, 45, 8, NOW(), NOW()),
          ('API Development', 'Build RESTful APIs', ${projects[2].id}, ${teamMembers[0].id}, ${pm.id}, 'review', '2025-01-25', 30, 50, 28, NOW(), NOW())
        ON DUPLICATE KEY UPDATE title=title
      `);
      console.log('✓ Tasks created');
    }

    // Create expenses
    console.log('Creating expenses...');
    if (teamMembers.length > 0) {
      await sequelize.query(`
        INSERT INTO Expenses (userId, projectId, amount, description, status, approvedByPm, createdAt, updatedAt)
        VALUES 
          (${teamMembers[0].id}, ${projects[0].id}, 1500, 'Client meeting travel expenses', 'approved', 1, NOW(), NOW()),
          (${teamMembers[0].id}, ${projects[0].id}, 800, 'Development tools subscription', 'approved', 1, NOW(), NOW()),
          (${teamMembers[1]?.id || teamMembers[0].id}, ${projects[1].id}, 500, 'Design materials and supplies', 'pending', 0, NOW(), NOW())
        ON DUPLICATE KEY UPDATE description=description
      `);
      console.log('✓ Expenses created');
    }

    // Create financial documents
    console.log('Creating financial documents...');
    await sequelize.query(`
      INSERT INTO SalesOrders (referenceNo, date, customerName, description, totalAmount, projectId, status, createdAt, updatedAt)
      VALUES 
        ('SO-2025-001', '2025-01-05', 'Tech Corp Inc', 'E-Commerce Website Development', 500000, ${projects[0].id}, 'confirmed', NOW(), NOW()),
        ('SO-2025-002', '2025-02-01', 'Mobile Solutions Ltd', 'Mobile App Development', 750000, ${projects[1].id}, 'draft', NOW(), NOW())
      ON DUPLICATE KEY UPDATE referenceNo=referenceNo
    `);

    await sequelize.query(`
      INSERT INTO PurchaseOrders (referenceNo, date, supplierName, description, totalAmount, projectId, status, createdAt, updatedAt)
      VALUES 
        ('PO-2025-001', '2025-01-10', 'Cloud Services Provider', 'Hosting and infrastructure', 50000, ${projects[0].id}, 'sent', NOW(), NOW()),
        ('PO-2025-002', '2025-02-05', 'Design Agency', 'UI/UX Design Services', 80000, ${projects[1].id}, 'draft', NOW(), NOW())
      ON DUPLICATE KEY UPDATE referenceNo=referenceNo
    `);

    await sequelize.query(`
      INSERT INTO Invoices (referenceNo, date, customerName, description, totalAmount, projectId, status, createdAt, updatedAt)
      VALUES 
        ('INV-2025-001', '2025-01-20', 'Tech Corp Inc', 'First milestone payment', 200000, ${projects[0].id}, 'paid', NOW(), NOW()),
        ('INV-2025-002', '2025-02-10', 'Tech Corp Inc', 'Second milestone payment', 150000, ${projects[0].id}, 'sent', NOW(), NOW())
      ON DUPLICATE KEY UPDATE referenceNo=referenceNo
    `);

    await sequelize.query(`
      INSERT INTO Bills (referenceNo, date, supplierName, description, totalAmount, projectId, status, createdAt, updatedAt)
      VALUES 
        ('BILL-2025-001', '2025-01-15', 'Cloud Services Provider', 'Monthly hosting charges', 15000, ${projects[0].id}, 'paid', NOW(), NOW())
      ON DUPLICATE KEY UPDATE referenceNo=referenceNo
    `);

    console.log('✓ Financial documents created');

    console.log('\n✅ Sample data seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@oneflow.com / admin123');
    console.log('PM: pm@oneflow.com / pm123');
    console.log('Team: alice@oneflow.com / alice123');
    console.log('Finance: finance@oneflow.com / finance123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

seedData();
