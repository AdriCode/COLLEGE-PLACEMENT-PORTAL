const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');

const router = express.Router();

router.post('/', auth, requireRole('student'), async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required.' });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    if (job.minCgpa != null) {
      const studentCgpa = profile?.cgpa;
      if (studentCgpa == null || studentCgpa < job.minCgpa) {
        return res.status(403).json({
          error: `Not eligible: minimum CGPA required is ${job.minCgpa}.${studentCgpa != null ? ` Your CGPA is ${studentCgpa}.` : ' Update your profile with CGPA.'}`,
        });
      }
    }
    if (job.eligibleBranches != null && job.eligibleBranches.length > 0) {
      const studentBranch = profile?.branch ? String(profile.branch).trim().toUpperCase() : null;
      const allowed = job.eligibleBranches.map((b) => String(b).trim().toUpperCase());
      if (!studentBranch || !allowed.includes(studentBranch)) {
        return res.status(403).json({
          error: `Not eligible: this job is for branches: ${job.eligibleBranches.join(', ')}.${studentBranch ? ` Your branch is ${profile.branch}.` : ' Add your branch in Profile.'}`,
        });
      }
    }
    const existing = await Application.findOne({ studentId: req.user.id, jobId });
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this job.' });
    }
    const application = new Application({
      studentId: req.user.id,
      jobId,
      status: 'applied',
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to apply.' });
  }
});

router.put('/:id/status', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be shortlisted or rejected.' });
    }
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }
    if (application.jobId.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only update applications for your jobs.' });
    }
    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update status.' });
  }
});

module.exports = router;
