const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  eligibility: { type: String, trim: true },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
