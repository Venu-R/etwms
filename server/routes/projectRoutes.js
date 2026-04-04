const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const log = require('../middleware/activityLogger');

router.post('/', protect, role('manager'), log('PROJECT_CREATED', 'project', (req, body) => body.data.project._id), ctrl.createProject);
router.get('/', protect, role('manager', 'admin'), ctrl.getProjects);
router.get('/:id', protect, role('manager', 'admin'), ctrl.getProjectById);
router.put('/:id', protect, role('manager'), log('PROJECT_UPDATED', 'project', (req) => req.params.id), ctrl.updateProject);
router.delete('/:id', protect, role('manager'), log('PROJECT_DELETED', 'project', (req) => req.params.id), ctrl.deleteProject);

module.exports = router;
