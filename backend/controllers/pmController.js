const { User, Project, Task, Timesheet, Expense } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Get PM dashboard analytics
exports.getPMAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects managed by this PM
    const managedProjects = await Project.findAll({
      where: { managerId: userId },
      attributes: ['id']
    });

    const projectIds = managedProjects.map(p => p.id);

    // If no projects, return empty analytics
    if (projectIds.length === 0) {
      return res.json({
        projectStats: [],
        taskStats: [],
        recentProjects: [],
        teamProductivity: []
      });
    }

    // Project statistics for PM's projects
    const projectStats = await Project.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { managerId: userId },
      group: ['status']
    });

    // Task statistics for PM's projects
    const taskStats = await Task.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        projectId: { [Op.in]: projectIds }
      },
      group: ['status']
    });

    // Recent projects with progress
    const recentProjects = await Project.findAll({
      where: { managerId: userId },
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

    // Team productivity for PM's projects
    const teamProductivity = await Task.findAll({
      attributes: [
        'assignedTo',
        [sequelize.fn('COUNT', sequelize.col('Task.id')), 'tasksCompleted']
      ],
      where: {
        projectId: { [Op.in]: projectIds },
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
      recentProjects: projectsWithProgress,
      teamProductivity
    });
  } catch (error) {
    console.error('PM analytics error:', error);
    res.status(500).json({ message: 'Error fetching PM analytics', error: error.message });
  }
};

module.exports = exports;
