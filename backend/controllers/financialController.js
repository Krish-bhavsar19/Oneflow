const { SalesOrder, PurchaseOrder, Invoice, Bill, Expense, Project } = require('../models');

// ==================== SALES ORDERS ====================
exports.getAllSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrder.findAll({
      include: [{ model: Project, as: 'project', attributes: ['id', 'title'] }],
      order: [['date', 'DESC']]
    });
    res.json(salesOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.create(req.body);
    res.status(201).json(salesOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findByPk(req.params.id);
    if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });
    
    await salesOrder.update(req.body);
    res.json(salesOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findByPk(req.params.id);
    if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });
    
    await salesOrder.destroy();
    res.json({ message: 'Sales Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PURCHASE ORDERS ====================
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll({
      include: [{ model: Project, as: 'project', attributes: ['id', 'title'] }],
      order: [['date', 'DESC']]
    });
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.create(req.body);
    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    if (!purchaseOrder) return res.status(404).json({ message: 'Purchase Order not found' });
    
    await purchaseOrder.update(req.body);
    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    if (!purchaseOrder) return res.status(404).json({ message: 'Purchase Order not found' });
    
    await purchaseOrder.destroy();
    res.json({ message: 'Purchase Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== INVOICES ====================
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: SalesOrder, as: 'salesOrder', attributes: ['id', 'referenceNo'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    await invoice.update(req.body);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    await invoice.destroy();
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== BILLS ====================
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'referenceNo'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    await bill.update(req.body);
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    await bill.destroy();
    res.json({ message: 'Bill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PROJECT FINANCIALS ====================
exports.getProjectFinancials = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [salesOrders, purchaseOrders, invoices, bills, expenses] = await Promise.all([
      SalesOrder.findAll({ where: { projectId } }),
      PurchaseOrder.findAll({ where: { projectId } }),
      Invoice.findAll({ where: { projectId } }),
      Bill.findAll({ where: { projectId } }),
      Expense.findAll({ where: { projectId } })
    ]);

    // Calculate totals
    const totalRevenue = [...salesOrders, ...invoices].reduce((sum, item) => 
      sum + parseFloat(item.totalAmount || 0), 0
    );

    const totalCosts = [...purchaseOrders, ...bills, ...expenses].reduce((sum, item) => 
      sum + parseFloat(item.amount || item.totalAmount || 0), 0
    );

    const profit = totalRevenue - totalCosts;

    res.json({
      salesOrders,
      purchaseOrders,
      invoices,
      bills,
      expenses,
      summary: {
        totalRevenue,
        totalCosts,
        profit,
        profitMargin: totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
