const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All routes require Finance role
router.use(protect);
router.use(authorize('sales_finance', 'admin'));

// Finance Analytics
router.get('/analytics', financeController.getFinanceAnalytics);

module.exports = router;
