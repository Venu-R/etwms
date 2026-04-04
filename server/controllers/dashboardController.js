const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.adminDashboard = async (req, res) => {
	try {
		const [userCount, teamCount, projectCount, taskCount, recentLogs] = await Promise.all([
			User.countDocuments({ isActive: true }),
			require('../models/Team').countDocuments(),
			Project.countDocuments(),
			Task.countDocuments(),
			ActivityLog.find().sort({ timestamp: -1 }).limit(20)
				.populate('userId', 'name role').lean(),
		]);
		res.json({ success: true, data: { userCount, teamCount, projectCount, taskCount, recentLogs } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.managerDashboard = async (req, res) => {
	try {
		const projects = await Project.find({ managerId: req.user.userId })
			.populate('teamId', 'name')
			.lean();
		const projectIds = projects.map((p) => p._id);
		const tasks = await Task.find({ projectId: { $in: projectIds } }).lean();
		res.json({ success: true, data: { projects, tasks } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.employeeDashboard = async (req, res) => {
	try {
		const tasks = await Task.find({ assignedTo: req.user.userId })
			.populate('projectId', 'title').lean();
		const pending = tasks.filter((t) => t.status === 'pending').length;
		const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
		const completed = tasks.filter((t) => t.status === 'completed').length;
		res.json({ success: true, data: { tasks, stats: { pending, inProgress, completed } } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getActivityLogs = async (req, res) => {
	try {
		const { page = 1, limit = 20, userId, entityType, action } = req.query;
		const filter = {};
		if (userId) filter.userId = userId;
		if (entityType) filter.entityType = entityType;
		if (action) filter.action = action;

		const logs = await ActivityLog.find(filter)
			.sort({ timestamp: -1 })
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.populate('userId', 'name role')
			.lean();
		const total = await ActivityLog.countDocuments(filter);
		res.json({ success: true, data: { logs, total, page: Number(page), limit: Number(limit) } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
