const { User, Project, Task, Timesheet, Expense } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Get Team Member analytics
exports.getTeamAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get tasks assigned to this team member
    const myTasks = await Task.findAll({
      where: { assignedTo: userId },
      attributes: ['id', 'status', 'estimatedHours', 'loggedHours']
    });

    // Task statistics
    const taskStats = await Task.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { assignedTo: userId },
      group: ['status']
    });

    // Total hours logged
    const totalHours = myTasks.reduce((sum, task) => sum + parseFloat(task.loggedHours || 0), 0);
    const totalEstimated = myTasks.reduce((sum, task) => sum + parseFloat(task.estimatedHours || 0), 0);

    // My expenses
    const myExpenses = await Expense.findAll({
      where: { userId },
      attributes: ['id', 'amount', 'status']
    });

    const totalExpenses = myExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const pendingExpenses = myExpenses.filter(e => e.status === 'pending').length;
    const approvedExpenses = myExpenses.filter(e => e.status === 'approved').length;

    // Recent tasks with project info
    const recentTasks = await Task.findAll({
      where: { assignedTo: userId },
      limit: 5,
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title']
        }
      ]
    });

    // Monthly productivity (last 6 months)
    const monthlyProductivity = await Task.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('updatedAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'completed']
      ],
      where: {
        assignedTo: userId,
        status: 'completed',
        updatedAt: {
          [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('updatedAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('updatedAt'), '%Y-%m'), 'ASC']]
    });

    res.json({
      taskStats,
      totalTasks: myTasks.length,
      totalHours: totalHours.toFixed(1),
      totalEstimated: totalEstimated.toFixed(1),
      totalExpenses: totalExpenses.toFixed(2),
      pendingExpenses,
      approvedExpenses,
      recentTasks,
      monthlyProductivity
    });
  } catch (error) {
    console.error('Team analytics error:', error);
    res.status(500).json({ message: 'Error fetching team analytics', error: error.message });
  }
};

module.exports = exports;
