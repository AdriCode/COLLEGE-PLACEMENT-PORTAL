const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Job = require('../models/Job');
const RecruiterProfile = require('../models/RecruiterProfile');
const Application = require('../models/Application');

const router = express.Router();

router.post('/', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ userId: req.user.id });
    if (!recruiterProfile || !recruiterProfile.approved) {
      return res.status(403).json({ error: 'Only approved recruiters can post jobs.' });
    }
    const { title, description, eligibility, minCgpa, eligibleBranches, deadline } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    const branches = Array.isArray(eligibleBranches) ? eligibleBranches.filter(Boolean) : undefined;
    const job = new Job({
      recruiterId: req.user.id,
      title,
      description: description || '',
      eligibility: eligibility || '',
      minCgpa: minCgpa != null && minCgpa !== '' ? Number(minCgpa) : undefined,
      eligibleBranches: branches?.length ? branches : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create job.' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.recruiterId && req.user.role === 'recruiter' && req.query.recruiterId === req.user.id) {
      filter.recruiterId = req.user.id;
    }
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list jobs.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get job.' });
  }
});

router.get('/:id/applications', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only view applications for your jobs.' });
    }
    const applications = await Application.find({ jobId: req.params.id })
      .populate('studentId', 'email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list applications.' });
  }
});

module.exports = router;
