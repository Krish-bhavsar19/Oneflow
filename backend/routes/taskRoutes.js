const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getMyTasks, 
  updateTaskStatus, 
  updateTask, 
  deleteTask,
  getTeamMembers,
  assignTask,
  getMyActiveTasks,
  getAllTasks
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, authorize('admin', 'project_manager'), createTask);
router.post('/assign', protect, authorize('admin', 'project_manager'), assignTask);
router.get('/all', protect, authorize('admin', 'project_manager'), getAllTasks);
router.get('/assigned', protect, getMyTasks);
router.get('/my-active-tasks', protect, getMyActiveTasks);
router.get('/team-members/:projectId', protect, authorize('admin', 'project_manager'), getTeamMembers);
router.put('/:id/status', protect, updateTaskStatus);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateTask);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteTask);

module.exports = router;
