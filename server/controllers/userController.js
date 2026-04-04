const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password').lean();
		res.json({ success: true, data: { users } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password').lean();
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });
		res.json({ success: true, data: { user } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { name, role, teamId, isActive, password } = req.body;
		const update = { name, role, teamId, isActive };
		if (password) update.password = await bcrypt.hash(password, 10);
		const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });
		res.json({ success: true, data: { user } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		if (String(req.user.userId) === String(req.params.id)) {
			return res.status(400).json({ success: false, message: 'Admin cannot delete own account' });
		}

		const user = await User.findByIdAndDelete(req.params.id).select('-password');
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });

		res.json({ success: true, data: { user } });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
