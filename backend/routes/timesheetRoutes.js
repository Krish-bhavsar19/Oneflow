const express = require('express');
const router = express.Router();
const { logHours, getMyTimesheets, getProjectTimesheets } = require('../controllers/timesheetController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, logHours);
router.get('/my', protect, getMyTimesheets);
router.get('/project/:id', protect, authorize('admin', 'project_manager'), getProjectTimesheets);

module.exports = router;
