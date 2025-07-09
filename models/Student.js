const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  motherName: String,
  contact: String,
  village: String,
  class: String,
  rollNo: Number,
  assignedTeacher: String,
  previousMarks: Number
});
module.exports = mongoose.model('Student', StudentSchema);
