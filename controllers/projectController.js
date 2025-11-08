const { Project, User } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, managerId, status } = req.body;

    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      managerId: managerId || req.user.id,
      status
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] }
      ]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, startDate, endDate, managerId, status } = req.body;

    await project.update({
      title: title || project.title,
      description: description || project.description,
      startDate: startDate || project.startDate,
      endDate: endDate || project.endDate,
      managerId: managerId || project.managerId,
      status: status || project.status
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
