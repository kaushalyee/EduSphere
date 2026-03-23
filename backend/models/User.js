const mongoose = require('mongoose');

const userOptions = { discriminatorKey: 'role', collection: 'users', timestamps: true };

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
}, userOptions);

const User = mongoose.model('User', userSchema);

const Student = User.discriminator('student', new mongoose.Schema({
  student_id: { type: String, required: true, unique: true, sparse: true, index: true },
  name: { type: String, required: true },
  tutor: { type: Boolean, default: false },
  academic_year: { type: Number },
  semester: { type: Number }
}));

const Admin = User.discriminator('admin', new mongoose.Schema({
  // role is handled by discriminatorKey
}));

module.exports = { User, Student, Admin };