const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entityType: { type: String, enum: ['task', 'project', 'user', 'team'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  metadata: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
});

activityLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
