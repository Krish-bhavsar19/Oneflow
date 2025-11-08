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

User.hasMany(Timesheet, { foreignKey: 'userId', as: 'timesheets' });
Timesheet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Timesheet, { foreignKey: 'projectId', as: 'timesheets' });
Timesheet.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Expense, { foreignKey: 'projectId', as: 'expenses' });
Expense.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

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
