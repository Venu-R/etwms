const Project = require('../models/Project');

exports.createProject = async (req, res) => {
	try {
		const { title, description, teamId, startDate, endDate } = req.body;
		const project = await Project.create({
			title,
			description,
			teamId,
			startDate,
			endDate,
			managerId: req.user.userId,
			status: 'planning',
		});
		res.status(201).json({ success: true, data: { project } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getProjects = async (req, res) => {
	try {
		const filter = req.user.role === 'manager' ? { managerId: req.user.userId } : {};
		const projects = await Project.find(filter).populate('teamId', 'name').lean();
		res.json({ success: true, data: { projects } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getProjectById = async (req, res) => {
	try {
		const project = await Project.findById(req.params.id)
			.populate('managerId', 'name email')
			.populate('teamId', 'name')
			.lean();
		if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
		res.json({ success: true, data: { project } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.updateProject = async (req, res) => {
	try {
		const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

		if (req.body.status === 'completed') {
			req.io.to(`project:${project._id}`).emit('project:closed', {
				projectId: project._id,
				title: project.title,
			});
		}

		res.json({ success: true, data: { project } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.deleteProject = async (req, res) => {
	try {
		await Project.findByIdAndDelete(req.params.id);
		res.json({ success: true, data: { message: 'Project deleted' } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
