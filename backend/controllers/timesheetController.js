const { Timesheet, User, Project } = require('../models');

exports.logHours = async (req, res) => {
  try {
    const { projectId, date, hoursWorked, description } = req.body;

    const timesheet = await Timesheet.create({
      userId: req.user.id,
      projectId,
      date,
      hoursWorked,
      description
    });

    res.status(201).json(timesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.findAll({
      where: { projectId: req.params.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
