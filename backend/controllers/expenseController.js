const { Expense, User, Project, SalesOrder, PurchaseOrder, Invoice, Bill } = require('../models');

exports.submitExpense = async (req, res) => {
  try {
    const { projectId, amount, description } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      projectId,
      amount,
      description,
      status: 'pending',
      type: 'expense',
      approvedByPm: false
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses for PM approval (including billing documents)
exports.getPmExpenses = async (req, res) => {
  try {
    // Get all expenses
    const expenses = await Expense.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get all billing documents
    const [salesOrders, purchaseOrders, invoices, bills] = await Promise.all([
      SalesOrder.findAll({ order: [['date', 'DESC']] }),
      PurchaseOrder.findAll({ order: [['date', 'DESC']] }),
      Invoice.findAll({ order: [['date', 'DESC']] }),
      Bill.findAll({ order: [['date', 'DESC']] })
    ]);

    // Transform billing documents to expense format
    const billingExpenses = [
      ...salesOrders.map(so => ({
        id: `so_${so.id}`,
        type: 'sales_order',
        amount: so.totalAmount,
        description: `Sales Order: ${so.referenceNo} - ${so.customerName}`,
        status: so.status,
        approvedByPm: so.status !== 'draft',
        createdAt: so.createdAt,
        referenceNo: so.referenceNo,
        customerName: so.customerName,
        originalId: so.id
      })),
      ...purchaseOrders.map(po => ({
        id: `po_${po.id}`,
        type: 'purchase_order',
        amount: po.totalAmount,
        description: `Purchase Order: ${po.referenceNo} - ${po.supplierName}`,
        status: po.status,
        approvedByPm: po.status !== 'draft',
        createdAt: po.createdAt,
        referenceNo: po.referenceNo,
        supplierName: po.supplierName,
        originalId: po.id
      })),
      ...invoices.map(inv => ({
        id: `inv_${inv.id}`,
        type: 'invoice',
        amount: inv.totalAmount,
        description: `Invoice: ${inv.referenceNo} - ${inv.customerName}`,
        status: inv.status,
        approvedByPm: inv.status !== 'draft',
        createdAt: inv.createdAt,
        referenceNo: inv.referenceNo,
        customerName: inv.customerName,
        originalId: inv.id
      })),
      ...bills.map(bill => ({
        id: `bill_${bill.id}`,
        type: 'bill',
        amount: bill.totalAmount,
        description: `Bill: ${bill.referenceNo} - ${bill.supplierName}`,
        status: bill.status,
        approvedByPm: bill.status !== 'draft',
        createdAt: bill.createdAt,
        referenceNo: bill.referenceNo,
        supplierName: bill.supplierName,
        originalId: bill.id
      }))
    ];

    // Combine and sort all
    const allExpenses = [...expenses, ...billingExpenses].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(allExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PM approves or rejects expense/billing document
exports.pmApproveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    // Check if it's a billing document
    if (id.startsWith('so_')) {
      const soId = id.replace('so_', '');
      const salesOrder = await SalesOrder.findByPk(soId);
      if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });
      salesOrder.status = action === 'approve' ? 'confirmed' : 'cancelled';
      await salesOrder.save();
      return res.json({ message: `Sales Order ${action}d`, data: salesOrder });
    }

    if (id.startsWith('po_')) {
      const poId = id.replace('po_', '');
      const purchaseOrder = await PurchaseOrder.findByPk(poId);
      if (!purchaseOrder) return res.status(404).json({ message: 'Purchase Order not found' });
      purchaseOrder.status = action === 'approve' ? 'sent' : 'cancelled';
      await purchaseOrder.save();
      return res.json({ message: `Purchase Order ${action}d`, data: purchaseOrder });
    }

    if (id.startsWith('inv_')) {
      const invId = id.replace('inv_', '');
      const invoice = await Invoice.findByPk(invId);
      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
      invoice.status = action === 'approve' ? 'sent' : 'cancelled';
      await invoice.save();
      return res.json({ message: `Invoice ${action}d`, data: invoice });
    }

    if (id.startsWith('bill_')) {
      const billId = id.replace('bill_', '');
      const bill = await Bill.findByPk(billId);
      if (!bill) return res.status(404).json({ message: 'Bill not found' });
      bill.status = action === 'approve' ? 'received' : 'cancelled';
      await bill.save();
      return res.json({ message: `Bill ${action}d`, data: bill });
    }

    // Regular expense
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.approvedByPm = action === 'approve';
    expense.status = action === 'approve' ? 'approved' : 'rejected';
    await expense.save();

    res.json({ message: `Expense ${action}d by PM`, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveExpense = async (req, res) => {
  try {
    const { status } = req.body;
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    expense.status = status;
    if (status === 'approved') {
      expense.approvedByPm = true;
    }
    await expense.save();

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
