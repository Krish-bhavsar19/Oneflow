const express = require('express');
const router = express.Router();
const { 
  submitExpense, 
  getMyExpenses, 
  getPendingExpenses, 
  approveExpense 
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, submitExpense);
router.get('/my', protect, getMyExpenses);
router.get('/pending', protect, authorize('admin', 'project_manager'), getPendingExpenses);
router.put('/:id/approve', protect, authorize('admin', 'project_manager'), approveExpense);

module.exports = router;
