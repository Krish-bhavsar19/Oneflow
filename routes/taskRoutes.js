const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getMyTasks, 
  updateTaskStatus, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, authorize('admin', 'project_manager'), createTask);
router.get('/assigned', protect, getMyTasks);
router.put('/:id/status', protect, updateTaskStatus);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateTask);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteTask);

module.exports = router;
