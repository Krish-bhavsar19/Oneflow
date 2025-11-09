const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard analytics
router.get('/analytics', adminController.getDashboardAnalytics);

// User management
router.get('/users', adminController.getAllUsersWithActivity);

// Project management
router.get('/projects', adminController.getAllProjectsDetailed);

// Financial overview
router.get('/financial', adminController.getFinancialOverview);

module.exports = router;
