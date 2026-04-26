require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function approveExistingStudents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all students with pending status who have NO documents uploaded
    // These are old students who registered before verification system
    const result = await User.updateMany(
      {
        role: 'student',
        verificationStatus: 'pending',
        studentIdPhoto: null,
        supportingDocument: null,
      },
      {
        $set: { verificationStatus: 'approved' },
      }
    );

    console.log(`Updated ${result.modifiedCount} existing students to approved`);
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

approveExistingStudents();
