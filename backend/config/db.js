const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    // Ensure fixed admin from env: create or reset password so login always works
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      let admin = await User.findOne({ email: adminEmail }).select('+password');
      if (!admin) {
        await User.create({ email: adminEmail, password: adminPassword, role: 'admin' });
        console.log('Default admin user created:', adminEmail);
      } else {
        admin.role = 'admin';
        admin.password = adminPassword;
        await admin.save();
        console.log('Admin credentials synced for', adminEmail);
      }
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
