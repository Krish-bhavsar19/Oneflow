const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SalesOrder = sequelize.define('SalesOrder', {
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
  customerName: {
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
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'delivered', 'cancelled'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true
});

module.exports = SalesOrder;
