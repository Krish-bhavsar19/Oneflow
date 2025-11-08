const { Expense, User, Project } = require('../models');

exports.submitExpense = async (req, res) => {
  try {
    const { projectId, amount, description } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      projectId,
      amount,
      description,
      status: 'pending'
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
    await expense.save();

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
