const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bill = sequelize.define('Bill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  referenceNo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Projects',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PurchaseOrders',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  status: {
    type: DataTypes.ENUM('draft', 'received', 'paid', 'overdue'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true
});

module.exports = Bill;
