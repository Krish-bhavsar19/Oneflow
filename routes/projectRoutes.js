const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, authorize('admin', 'project_manager'), createProject);
router.get('/', protect, authorize('admin', 'project_manager'), getAllProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
