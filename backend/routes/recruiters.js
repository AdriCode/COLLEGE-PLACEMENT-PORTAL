const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const RecruiterProfile = require('../models/RecruiterProfile');

const router = express.Router();

router.get('/pending', auth, requireRole('admin'), async (req, res) => {
  try {
    const list = await RecruiterProfile.find({ approved: false })
      .populate('userId', 'email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list pending recruiters.' });
  }
});

router.put('/:id/approve', auth, requireRole('admin'), async (req, res) => {
  try {
    const profile = await RecruiterProfile.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ error: 'Recruiter profile not found.' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to approve.' });
  }
});

router.get('/profile', auth, requireRole('recruiter'), async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Create one first.' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get profile.' });
  }
});

router.put('/profile', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const { companyName } = req.body;
    let profile = await RecruiterProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new RecruiterProfile({ userId: req.user.id, companyName: companyName || '', approved: false });
    } else {
      if (companyName !== undefined) profile.companyName = companyName;
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update profile.' });
  }
});

module.exports = router;
