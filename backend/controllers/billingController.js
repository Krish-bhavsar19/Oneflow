const { SalesOrder, PurchaseOrder, Invoice, Bill, Expense } = require('../models');

// Sales Orders
exports.createSalesOrder = async (req, res) => {
  try {
    const { referenceNo, date, customerName, totalAmount, status, projectId } = req.body;
    const salesOrder = await SalesOrder.create({
      referenceNo,
      date,
      customerName,
      totalAmount,
      status
    });

    // Create expense entry for PM approval
    if (projectId) {
      await Expense.create({
        userId: req.user.id,
        projectId,
        amount: totalAmount,
        description: `Sales Order: ${referenceNo} - ${customerName}`,
        type: 'sales_order',
        referenceId: salesOrder.id,
        status: 'pending',
        approvedByPm: false
      });
    }

    res.status(201).json(salesOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrder.findAll({ order: [['date', 'DESC']] });
    res.json(salesOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Purchase Orders
exports.createPurchaseOrder = async (req, res) => {
  try {
    const { referenceNo, date, supplierName, totalAmount, status, projectId } = req.body;
    const purchaseOrder = await PurchaseOrder.create({
      referenceNo,
      date,
      supplierName,
      totalAmount,
      status
    });

    // Create expense entry for PM approval
    if (projectId) {
      await Expense.create({
        userId: req.user.id,
        projectId,
        amount: totalAmount,
        description: `Purchase Order: ${referenceNo} - ${supplierName}`,
        type: 'purchase_order',
        referenceId: purchaseOrder.id,
        status: 'pending',
        approvedByPm: false
      });
    }

    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll({ order: [['date', 'DESC']] });
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Invoices
exports.createInvoice = async (req, res) => {
  try {
    const { referenceNo, date, customerName, totalAmount, status, projectId } = req.body;
    const invoice = await Invoice.create({
      referenceNo,
      date,
      customerName,
      totalAmount,
      status
    });

    // Create expense entry for PM approval
    if (projectId) {
      await Expense.create({
        userId: req.user.id,
        projectId,
        amount: totalAmount,
        description: `Invoice: ${referenceNo} - ${customerName}`,
        type: 'invoice',
        referenceId: invoice.id,
        status: 'pending',
        approvedByPm: false
      });
    }

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ order: [['date', 'DESC']] });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bills
exports.createBill = async (req, res) => {
  try {
    const { referenceNo, date, supplierName, totalAmount, status, projectId } = req.body;
    const bill = await Bill.create({
      referenceNo,
      date,
      supplierName,
      totalAmount,
      status
    });

    // Create expense entry for PM approval
    if (projectId) {
      await Expense.create({
        userId: req.user.id,
        projectId,
        amount: totalAmount,
        description: `Bill: ${referenceNo} - ${supplierName}`,
        type: 'bill',
        referenceId: bill.id,
        status: 'pending',
        approvedByPm: false
      });
    }

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({ order: [['date', 'DESC']] });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
