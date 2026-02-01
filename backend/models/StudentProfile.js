const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: { type: String, required: true, trim: true },
  branch: { type: String, trim: true, enum: ['CS', 'IT', 'SE', 'MCE', 'ECE', 'EE', 'ME', 'PIE', 'CE', 'ENE', 'BT'] },
  cgpa: { type: Number },
  resumeUrl: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
