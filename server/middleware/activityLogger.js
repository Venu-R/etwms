const ActivityLog = require('../models/ActivityLog');

const logActivity = (action, entityType, getEntityId, getMetadata = () => ({})) => {
	return async (req, res, next) => {
		const originalJson = res.json.bind(res);

		res.json = async (body) => {
			if (body && body.success) {
				try {
					const entityId = getEntityId(req, body);
					if (entityId) {
						await ActivityLog.create({
							userId: req.user.userId,
							action,
							entityType,
							entityId,
							metadata: getMetadata(req, body),
						});
					}
				} catch (e) {
					console.error('ActivityLog error:', e.message);
				}
			}

			return originalJson(body);
		};

		next();
	};
};

module.exports = logActivity;
