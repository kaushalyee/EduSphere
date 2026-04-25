const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edusphere');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@student.com' });
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('Demo123', 10);
    const demoUser = new User({
      name: 'Demo Student',
      email: 'demo@student.com',
      password: hashedPassword,
      role: 'student',
      studentID: 'IT12345678',
      year: 2,
      semester: 1,
      weakCategories: ['Programming Languages', 'Data Structures & Algorithms'],
      weakTopics: []
    });

    await demoUser.save();
    console.log('Demo user created successfully!');
    console.log('Email: demo@student.com');
    console.log('Password: Demo123');

  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createDemoUser();