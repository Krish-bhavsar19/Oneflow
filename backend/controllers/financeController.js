const { SalesOrder, PurchaseOrder, Invoice, Bill, Expense, Project } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Get Finance analytics
exports.getFinanceAnalytics = async (req, res) => {
  try {
    // Sales Orders statistics
    const salesOrderStats = await SalesOrder.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
      ],
      group: ['status']
    });

    // Purchase Orders statistics
    const purchaseOrderStats = await PurchaseOrder.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
      ],
      group: ['status']
    });

    // Invoice statistics
    const invoiceStats = await Invoice.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
      ],
      group: ['status']
    });

    // Bill statistics
    const billStats = await Bill.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['status']
    });

    // Expense statistics
    const expenseStats = await Expense.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['status']
    });

    // Monthly revenue trends (last 6 months)
    const revenueTrends = await SalesOrder.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        date: {
          [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'ASC']]
    });

    // Monthly expense trends (last 6 months)
    const expenseTrends = await Expense.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'expenses']
      ],
      where: {
        createdAt: {
          [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
    });

    // Calculate totals
    const totalRevenue = await SalesOrder.sum('totalAmount') || 0;
    const totalExpenses = await Expense.sum('amount') || 0;
    const totalInvoices = await Invoice.sum('totalAmount') || 0;
    const totalBills = await Bill.sum('amount') || 0;

    // Pending approvals
    const pendingExpenses = await Expense.count({ where: { status: 'pending' } });
    const pendingInvoices = await Invoice.count({ where: { status: 'pending' } });

    res.json({
      salesOrderStats,
      purchaseOrderStats,
      invoiceStats,
      billStats,
      expenseStats,
      revenueTrends,
      expenseTrends,
      totals: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        invoices: totalInvoices,
        bills: totalBills,
        profit: totalRevenue - totalExpenses
      },
      pending: {
        expenses: pendingExpenses,
        invoices: pendingInvoices
      }
    });
  } catch (error) {
    console.error('Finance analytics error:', error);
    res.status(500).json({ message: 'Error fetching finance analytics', error: error.message });
  }
};

module.exports = exports;
