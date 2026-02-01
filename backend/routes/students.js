const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');

const router = express.Router();

router.use(auth);
router.use(requireRole('student'));

router.get('/profile', async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Create one first.' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get profile.' });
  }
});

const ALLOWED_BRANCHES = ['CS', 'IT', 'SE', 'MCE', 'ECE', 'EE', 'ME', 'PIE', 'CE', 'ENE', 'BT'];

router.put('/profile', async (req, res) => {
  try {
    const { name, branch, cgpa, resumeUrl } = req.body;
    const branchVal = branch === '' || branch === undefined ? undefined : String(branch).trim().toUpperCase();
    if (branchVal && !ALLOWED_BRANCHES.includes(branchVal)) {
      return res.status(400).json({ error: `Branch must be one of: ${ALLOWED_BRANCHES.join(', ')}` });
    }
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id, name: name || '', branch: branchVal, cgpa, resumeUrl });
    } else {
      if (name !== undefined) profile.name = name;
      if (branch !== undefined) profile.branch = branchVal;
      if (cgpa !== undefined) profile.cgpa = cgpa;
      if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update profile.' });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('jobId', 'title description eligibility deadline')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get applications.' });
  }
});

module.exports = router;
