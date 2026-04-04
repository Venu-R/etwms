const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
