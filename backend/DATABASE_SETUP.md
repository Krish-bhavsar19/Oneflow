# Database Setup Guide

This guide will help you set up and verify the database for the OneFlow project management system.

## Prerequisites

1. **MySQL Server** - Make sure MySQL is installed and running
   - XAMPP/WAMP users: Start MySQL from the control panel
   - Windows Services: Start MySQL service
   - Verify: `mysql -u root -p`

2. **Node.js** - Ensure Node.js and npm are installed
   - Verify: `node --version` and `npm --version`

3. **Environment Variables** - Create a `.env` file in the backend directory
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=oneflow_db
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=1d
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=your_session_secret_key_change_this_in_production
   ```

## Setup Steps

### Step 1: Install Dependencies
```bash
cd Oneflow/backend
npm install
```

### Step 2: Test Database Connection
```bash
npm run test-db
```

This will verify:
- MySQL server is accessible
- Database credentials are correct
- Database exists (or tells you to create it)

### Step 3: Create Database
```bash
npm run setup-db
```

This creates the database if it doesn't exist.

### Step 4: Synchronize Database Schemas
```bash
npm run sync-db
```

This will:
- Create all required tables (Users, Projects, Tasks, Timesheets, Expenses, SalesOrders, PurchaseOrders, Invoices, Bills)
- Set up foreign key relationships
- Create indexes
- Update existing tables if needed (development mode only)

### Step 5: Verify Database Schemas
```bash
npm run verify-schema
```

This comprehensive verification checks:
- ✓ All 9 tables exist
- ✓ All columns have correct types and constraints
- ✓ Foreign keys are properly configured
- ✓ Model associations are working
- ✓ Indexes are created

### Step 6: Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Database Schema Overview

The application uses 9 main tables:

### Core Tables
1. **Users** - User accounts with roles (admin, project_manager, team_member, sales_finance)
2. **Projects** - Projects managed by project managers
3. **Tasks** - Tasks assigned to team members within projects
4. **Timesheets** - Time tracking entries for users on projects
5. **Expenses** - Expense submissions by team members

### Billing Tables
6. **SalesOrders** - Sales orders for customers
7. **PurchaseOrders** - Purchase orders from suppliers
8. **Invoices** - Invoices sent to customers
9. **Bills** - Bills received from suppliers

## Relationships

- **User** → **Project** (One-to-Many: managerId)
- **Project** → **Task** (One-to-Many: projectId)
- **User** → **Task** (One-to-Many: assignedTo)
- **User** → **Timesheet** (One-to-Many: userId)
- **Project** → **Timesheet** (One-to-Many: projectId)
- **User** → **Expense** (One-to-Many: userId)
- **Project** → **Expense** (One-to-Many: projectId)

## Troubleshooting

### Error: ECONNREFUSED
**Problem:** MySQL server is not running

**Solution:**
- Start MySQL from XAMPP/WAMP control panel
- Or start MySQL from Windows Services
- Verify: `mysql -u root -p`

### Error: ER_ACCESS_DENIED_ERROR
**Problem:** Invalid MySQL credentials

**Solution:**
- Check `DB_USER` in .env (usually "root")
- Check `DB_PASSWORD` in .env
- For XAMPP default, try empty password: `DB_PASSWORD=`

### Error: ER_BAD_DB_ERROR
**Problem:** Database doesn't exist

**Solution:**
- Run: `npm run setup-db`
- Or manually: `CREATE DATABASE oneflow_db;`

### Schema Verification Fails
**Problem:** Tables or columns don't match expected schema

**Solution:**
- Run: `npm run sync-db` to synchronize schemas
- Check for any error messages
- Verify all models are correctly defined

### Foreign Keys Not Working
**Problem:** Foreign key constraints are missing

**Solution:**
- Run: `npm run sync-db` to recreate tables with proper foreign keys
- Check that referenced tables exist
- Verify model associations in `models/index.js`

## Available Scripts

- `npm run setup-db` - Create database if it doesn't exist
- `npm run sync-db` - Synchronize all table schemas
- `npm run verify-schema` - Verify all schemas are correct
- `npm run test-db` - Test database connection
- `npm start` - Start the server
- `npm run dev` - Start server with auto-reload

## Quick Setup (All Steps)

```bash
# 1. Install dependencies
npm install

# 2. Test connection
npm run test-db

# 3. Create database
npm run setup-db

# 4. Sync schemas
npm run sync-db

# 5. Verify schemas
npm run verify-schema

# 6. Start server
npm start
```

## Notes

- The `sync-db` script uses `alter: true` in development mode, which safely updates existing tables
- In production, `alter: false` is used to prevent accidental schema changes
- Foreign keys are automatically created by Sequelize based on model definitions
- Associations are defined in `models/index.js` and are automatically set up when models are loaded

