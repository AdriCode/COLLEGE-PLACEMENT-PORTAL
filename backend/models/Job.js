const mongoose = require('mongoose');

const ELIGIBLE_BRANCHES = ['CS', 'IT', 'SE', 'MCE', 'ECE', 'EE', 'ME', 'PIE', 'CE', 'ENE', 'BT'];

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  eligibility: { type: String, trim: true },
  minCgpa: { type: Number, min: 0, max: 10 },
  eligibleBranches: {
    type: [String],
    enum: ELIGIBLE_BRANCHES,
    default: undefined,
  },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
