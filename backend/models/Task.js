const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('todo', 'in_progress', 'review', 'completed', 'active'),
    defaultValue: 'todo'
  },
  dueDate: {
    type: DataTypes.DATE
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  loggedHours: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Total hours logged for this task'
  },
  payPerHour: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Pay rate per hour for this task'
  },
  estimatedHours: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Estimated hours to complete'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['projectId']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Task;
