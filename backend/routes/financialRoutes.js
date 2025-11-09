const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Sales Orders
router.get('/sales-orders', protect, financialController.getAllSalesOrders);
router.post('/sales-orders', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.createSalesOrder);
router.put('/sales-orders/:id', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.updateSalesOrder);
router.delete('/sales-orders/:id', protect, authorize('admin', 'project_manager'), financialController.deleteSalesOrder);

// Purchase Orders
router.get('/purchase-orders', protect, financialController.getAllPurchaseOrders);
router.post('/purchase-orders', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.createPurchaseOrder);
router.put('/purchase-orders/:id', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.updatePurchaseOrder);
router.delete('/purchase-orders/:id', protect, authorize('admin', 'project_manager'), financialController.deletePurchaseOrder);

// Invoices
router.get('/invoices', protect, financialController.getAllInvoices);
router.post('/invoices', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.createInvoice);
router.put('/invoices/:id', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.updateInvoice);
router.delete('/invoices/:id', protect, authorize('admin', 'project_manager'), financialController.deleteInvoice);

// Bills
router.get('/bills', protect, financialController.getAllBills);
router.post('/bills', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.createBill);
router.put('/bills/:id', protect, authorize('admin', 'project_manager', 'sales_finance'), financialController.updateBill);
router.delete('/bills/:id', protect, authorize('admin', 'project_manager'), financialController.deleteBill);

// Project Financials
router.get('/projects/:projectId/financials', protect, financialController.getProjectFinancials);

module.exports = router;
