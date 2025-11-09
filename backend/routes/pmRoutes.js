const express = require('express');
const router = express.Router();
const pmController = require('../controllers/pmController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All routes require PM or Admin role
router.use(protect);
router.use(authorize('project_manager', 'admin'));

// PM Dashboard Analytics
router.get('/analytics', pmController.getPMAnalytics);

module.exports = router;
