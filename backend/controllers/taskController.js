const { Task, User, Project } = require('../models');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      status,
      dueDate,
      assignedBy: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team members for a project
exports.getTeamMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Get all users with role team_member
    const teamMembers = await User.findAll({
      where: { role: 'team_member' },
      attributes: ['id', 'name', 'email', 'role']
    });

    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign task to team member (PM specific)
exports.assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    // Verify the user is PM or Admin
    if (!['admin', 'project_manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to assign tasks' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      status: 'active',
      dueDate,
      assignedBy: req.user.id
    });

    const taskWithDetails = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ]
    });

    res.status(201).json(taskWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active tasks for logged-in team member
exports.getMyActiveTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { 
        assignedTo: req.user.id,
        status: 'active'
      },
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ],
      order: [['dueDate', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks (for PM/Admin)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedTo: req.user.id },
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, assignedTo, projectId, status, dueDate } = req.body;

    await task.update({
      title: title || task.title,
      description: description || task.description,
      assignedTo: assignedTo || task.assignedTo,
      projectId: projectId || task.projectId,
      status: status || task.status,
      dueDate: dueDate || task.dueDate
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
