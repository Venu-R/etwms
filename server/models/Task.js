const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  comments: [commentSchema],
  attachments: [attachmentSchema],
}, { timestamps: true });

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ projectId: 1 });

module.exports = mongoose.model('Task', taskSchema);
