const express = require('express');
const router = express.Router();
const { 
  createSalesOrder, 
  getAllSalesOrders,
  createPurchaseOrder,
  getAllPurchaseOrders,
  createInvoice,
  getAllInvoices,
  createBill,
  getAllBills
} = require('../controllers/billingController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Sales Orders
router.post('/sales-orders', protect, authorize('admin', 'sales_finance'), createSalesOrder);
router.get('/sales-orders', protect, authorize('admin', 'sales_finance'), getAllSalesOrders);

// Purchase Orders
router.post('/purchase-orders', protect, authorize('admin', 'sales_finance'), createPurchaseOrder);
router.get('/purchase-orders', protect, authorize('admin', 'sales_finance'), getAllPurchaseOrders);

// Invoices
router.post('/invoices', protect, authorize('admin', 'sales_finance'), createInvoice);
router.get('/invoices', protect, authorize('admin', 'sales_finance'), getAllInvoices);

// Bills
router.post('/bills', protect, authorize('admin', 'sales_finance'), createBill);
router.get('/bills', protect, authorize('admin', 'sales_finance'), getAllBills);

module.exports = router;
