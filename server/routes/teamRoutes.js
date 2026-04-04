const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teamController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const log = require('../middleware/activityLogger');

router.post('/', protect, role('admin'), log('TEAM_CREATED', 'team', (req, body) => body.data.team._id), ctrl.createTeam);
router.get('/', protect, role('admin'), ctrl.getAllTeams);
router.put('/:id', protect, role('admin'), log('TEAM_UPDATED', 'team', (req) => req.params.id), ctrl.updateTeam);
router.delete('/:id', protect, role('admin'), log('TEAM_DELETED', 'team', (req) => req.params.id), ctrl.deleteTeam);

module.exports = router;
