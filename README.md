# OneFlow - Project Management System Backend

A complete Node.js + Express backend with MySQL database for a project management system.

## Features

- JWT-based authentication
- Role-based access control (Admin, Project Manager, Team Member, Sales/Finance)
- RESTful APIs for all modules
- MySQL database with Sequelize ORM
- Input validation
- Secure password hashing

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcrypt
- express-validator

## Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
copy .env.example .env
```

4. Update the `.env` file with your MySQL credentials:
   - `DB_USER` - usually "root"
   - `DB_PASSWORD` - your MySQL password (empty for XAMPP default)
   - `DB_NAME` - "oneflow_db"
   - `DB_HOST` - "localhost"

5. **Test MySQL connection:**
```bash
npm run test-db
```

6. **Create database automatically:**
```bash
npm run setup-db
```

Or manually:
```sql
CREATE DATABASE oneflow_db;
```

7. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Troubleshooting Database Connection

### Error: ECONNREFUSED
**Problem:** MySQL server is not running

**Solutions:**
- Start MySQL from XAMPP/WAMP control panel
- Or start from Windows Services
- Verify MySQL is running: `mysql -u root -p`

### Error: ER_ACCESS_DENIED_ERROR
**Problem:** Invalid credentials

**Solutions:**
- Check `DB_USER` in .env (usually "root")
- Check `DB_PASSWORD` in .env
- For XAMPP default, try empty password: `DB_PASSWORD=`

### Error: ER_BAD_DB_ERROR
**Problem:** Database doesn't exist

**Solutions:**
- Run: `npm run setup-db`
- Or manually: `CREATE DATABASE oneflow_db;`

### Test Your Connection
```bash
npm run test-db
```

This will check:
- MySQL server connectivity
- Database existence
- Credentials validity

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Projects
- `POST /api/projects` - Create project (PM/Admin)
- `GET /api/projects` - Get all projects (PM/Admin)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (PM/Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Tasks
- `POST /api/tasks` - Create task (PM/Admin)
- `GET /api/tasks/assigned` - Get my tasks
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id` - Update task (PM/Admin)
- `DELETE /api/tasks/:id` - Delete task (PM/Admin)

### Timesheets
- `POST /api/timesheets` - Log work hours
- `GET /api/timesheets/my` - Get my timesheets
- `GET /api/timesheets/project/:id` - Get project timesheets (PM/Admin)

### Expenses
- `POST /api/expenses` - Submit expense
- `GET /api/expenses/my` - Get my expenses
- `GET /api/expenses/pending` - Get pending expenses (PM/Admin)
- `PUT /api/expenses/:id/approve` - Approve/reject expense (PM/Admin)

### Billing (Sales/Finance)
- `POST /api/sales-orders` - Create sales order
- `GET /api/sales-orders` - Get all sales orders
- `POST /api/purchase-orders` - Create purchase order
- `GET /api/purchase-orders` - Get all purchase orders
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - Get all invoices
- `POST /api/bills` - Create bill
- `GET /api/bills` - Get all bills

## User Roles

- **admin** - Full system access
- **project_manager** - Manage projects, tasks, approve expenses
- **team_member** - View tasks, log hours, submit expenses (default role)
- **sales_finance** - Manage billing documents

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Environment Variables

See `.env.example` for required environment variables.

## Database Schema

The application uses Sequelize ORM with the following models:
- User
- Project
- Task
- Timesheet
- Expense
- SalesOrder
- PurchaseOrder
- Invoice
- Bill

## License

ISC
