const Team = require('../models/Team');
const User = require('../models/User');

exports.createTeam = async (req, res) => {
	try {
		const { name, managerId, memberIds } = req.body;
		const team = await Team.create({ name, managerId, memberIds: memberIds || [] });
		res.status(201).json({ success: true, data: { team } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getAllTeams = async (req, res) => {
	try {
		const teams = await Team.find().populate('managerId', 'name email').lean();
		res.json({ success: true, data: { teams } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.updateTeam = async (req, res) => {
	try {
		const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
		res.json({ success: true, data: { team } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.deleteTeam = async (req, res) => {
	try {
		await Team.findByIdAndDelete(req.params.id);
		res.json({ success: true, data: { message: 'Team deleted' } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
