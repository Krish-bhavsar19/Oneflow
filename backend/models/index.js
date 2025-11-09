const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const Timesheet = require('./Timesheet');
const Expense = require('./Expense');
const SalesOrder = require('./SalesOrder');
const PurchaseOrder = require('./PurchaseOrder');
const Invoice = require('./Invoice');
const Bill = require('./Bill');

// Define associations
User.hasMany(Project, { foreignKey: 'managerId', as: 'managedProjects' });
Project.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

User.hasMany(Task, { foreignKey: 'assignedBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });

User.hasMany(Timesheet, { foreignKey: 'userId', as: 'timesheets' });
Timesheet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Timesheet, { foreignKey: 'projectId', as: 'timesheets' });
Timesheet.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Expense, { foreignKey: 'projectId', as: 'expenses' });
Expense.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Sales Orders
Project.hasMany(SalesOrder, { foreignKey: 'projectId', as: 'salesOrders' });
SalesOrder.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Purchase Orders
Project.hasMany(PurchaseOrder, { foreignKey: 'projectId', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Invoices
Project.hasMany(Invoice, { foreignKey: 'projectId', as: 'invoices' });
Invoice.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
SalesOrder.hasMany(Invoice, { foreignKey: 'salesOrderId', as: 'invoices' });
Invoice.belongsTo(SalesOrder, { foreignKey: 'salesOrderId', as: 'salesOrder' });

// Bills
Project.hasMany(Bill, { foreignKey: 'projectId', as: 'bills' });
Bill.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
PurchaseOrder.hasMany(Bill, { foreignKey: 'purchaseOrderId', as: 'bills' });
Bill.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

module.exports = {
  User,
  Project,
  Task,
  Timesheet,
  Expense,
  SalesOrder,
  PurchaseOrder,
  Invoice,
  Bill
};
