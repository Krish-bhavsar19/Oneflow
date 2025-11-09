const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All routes require Team Member role
router.use(protect);
router.use(authorize('team_member', 'admin'));

// Team Analytics
router.get('/analytics', teamController.getTeamAnalytics);

module.exports = router;
