const { User, Project, Task, Timesheet, Expense, Bill } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Get comprehensive dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Project statistics
    const projectStats = await Project.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Task statistics
    const taskStats = await Task.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // User role distribution
    const userStats = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    // Recent projects with progress
    const recentProjects = await Project.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status']
        }
      ]
    });

    // Calculate project completion rates
    const projectsWithProgress = recentProjects.map(project => {
      const tasks = project.tasks || [];
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...project.toJSON(),
        totalTasks,
        completedTasks,
        progress
      };
    });

    // Monthly expense trends
    const expenseTrends = await Expense.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: {
        createdAt: {
          [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 6 MONTH)')
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
    });

    // Team productivity (tasks completed per user)
    const teamProductivity = await Task.findAll({
      attributes: [
        'assignedTo',
        [sequelize.fn('COUNT', sequelize.col('Task.id')), 'tasksCompleted']
      ],
      where: {
        status: 'completed',
        updatedAt: {
          [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 30 DAY)')
        }
      },
      include: [{
        model: User,
        as: 'assignee',
        attributes: ['id', 'name', 'email', 'role']
      }],
      group: ['assignedTo'],
      order: [[sequelize.fn('COUNT', sequelize.col('Task.id')), 'DESC']],
      limit: 10
    });

    res.json({
      projectStats,
      taskStats,
      userStats,
      recentProjects: projectsWithProgress,
      expenseTrends,
      teamProductivity
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Error fetching dashboard analytics', error: error.message });
  }
};

// Get all users with their activity
exports.getAllUsersWithActivity = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isEmailVerified', 'createdAt'],
      include: [
        {
          model: Task,
          as: 'assignedTasks',
          attributes: ['id', 'status'],
          required: false
        },
        {
          model: Project,
          as: 'managedProjects',
          attributes: ['id', 'title', 'status'],
          required: false
        }
      ]
    });

    const usersWithStats = users.map(user => {
      const tasks = user.assignedTasks || [];
      const projects = user.managedProjects || [];
      
      return {
        ...user.toJSON(),
        stats: {
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          activeTasks: tasks.filter(t => ['todo', 'in_progress', 'review'].includes(t.status)).length,
          managedProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length
        }
      };
    });

    res.json(usersWithStats);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get all projects with detailed info
exports.getAllProjectsDetailed = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Task,
          as: 'tasks',
          include: [{
            model: User,
            as: 'assignee',
            attributes: ['id', 'name', 'email']
          }]
        },
        {
          model: Expense,
          as: 'expenses',
          attributes: ['id', 'amount']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const projectsWithMetrics = projects.map(project => {
      const tasks = project.tasks || [];
      const expenses = project.expenses || [];
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

      return {
        ...project.toJSON(),
        metrics: {
          totalTasks,
          completedTasks,
          inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
          todoTasks: tasks.filter(t => t.status === 'todo').length,
          progress,
          totalExpenses,
          teamSize: new Set(tasks.map(t => t.assignedTo).filter(Boolean)).size
        }
      };
    });

    res.json(projectsWithMetrics);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get financial overview
exports.getFinancialOverview = async (req, res) => {
  try {
    const totalExpenses = await Expense.sum('amount') || 0;
    const totalBills = await Bill.sum('amount') || 0;

    const expensesByStatus = await Expense.findAll({
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const recentExpenses = await Expense.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      totalExpenses,
      totalBills,
      expensesByStatus,
      recentExpenses
    });
  } catch (error) {
    console.error('Financial overview error:', error);
    res.status(500).json({ message: 'Error fetching financial overview', error: error.message });
  }
};

module.exports = exports;
