const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: { type: String, required: true, trim: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
