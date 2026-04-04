const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId, role) =>
	jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Email and password required' });
		}

		const user = await User.findOne({ email, isActive: true });
		if (!user) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}

		const token = generateToken(user._id.toString(), user.role);
		return res.json({
			success: true,
			data: {
				token,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					teamId: user.teamId,
				},
			},
		});
	} catch (err) {
		return res.status(500).json({ success: false, message: err.message });
	}
};

exports.register = async (req, res) => {
	try {
		const { name, email, password, role, teamId } = req.body;
		if (!name || !email || !password || !role) {
			return res.status(400).json({ success: false, message: 'name, email, password, role required' });
		}

		const exists = await User.findOne({ email });
		if (exists) {
			return res.status(409).json({ success: false, message: 'Email already in use' });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({
			name,
			email,
			password: hashed,
			role,
			teamId: teamId || null,
		});

		return res.status(201).json({
			success: true,
			data: {
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			},
		});
	} catch (err) {
		return res.status(500).json({ success: false, message: err.message });
	}
};

exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).select('-password');
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}
		return res.json({ success: true, data: { user } });
	} catch (err) {
		return res.status(500).json({ success: false, message: err.message });
	}
};
