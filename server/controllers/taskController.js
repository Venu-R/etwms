const Task = require('../models/Task');

exports.createTask = async (req, res) => {
	try {
		const { title, description, projectId, assignedTo, priority, deadline } = req.body;
		const task = await Task.create({
			title,
			description,
			projectId,
			assignedTo,
			priority,
			deadline,
			createdBy: req.user.userId,
			status: 'pending',
		});

		req.io.to(`user:${assignedTo}`).emit('task:assigned', {
			taskId: task._id,
			title: task.title,
			assignedTo: task.assignedTo,
			projectId: task.projectId,
		});

		res.status(201).json({ success: true, data: { task } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getTasksByProject = async (req, res) => {
	try {
		const tasks = await Task.find({ projectId: req.params.projectId })
			.populate('assignedTo', 'name email')
			.lean();
		res.json({ success: true, data: { tasks } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getMyTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ assignedTo: req.user.userId })
			.populate('projectId', 'title')
			.lean();
		res.json({ success: true, data: { tasks } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.updateTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

		if (req.body.status) {
			req.io.to(`project:${task.projectId}`).emit('task:updated', {
				taskId: task._id,
				status: task.status,
				updatedBy: req.user.userId,
			});
		}

		res.json({ success: true, data: { task } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.addComment = async (req, res) => {
	try {
		const { text } = req.body;
		const task = await Task.findByIdAndUpdate(
			req.params.id,
			{ $push: { comments: { userId: req.user.userId, text, timestamp: new Date() } } },
			{ new: true }
		);
		if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

		const newComment = task.comments[task.comments.length - 1];
		req.io.to(`project:${task.projectId}`).emit('task:commented', {
			taskId: task._id,
			comment: newComment,
			userId: req.user.userId,
		});

		res.json({ success: true, data: { comment: newComment } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.deleteTask = async (req, res) => {
	try {
		await Task.findByIdAndDelete(req.params.id);
		res.json({ success: true, data: { message: 'Task deleted' } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
