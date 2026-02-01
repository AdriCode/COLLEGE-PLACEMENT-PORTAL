const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');

const router = express.Router();

router.use(auth);
router.use(requireRole('admin'));

router.get('/stats', async (req, res) => {
  try {
    const [jobsCount, applicationsCount, studentsCount, recruitersCount] = await Promise.all([
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: 'student' }),
      RecruiterProfile.countDocuments({ approved: true }),
    ]);
    res.json({
      jobs: jobsCount,
      applications: applicationsCount,
      students: studentsCount,
      approvedRecruiters: recruitersCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get stats.' });
  }
});

module.exports = router;
