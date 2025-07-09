const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const twilio = require('twilio');

// Replace with your Twilio credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

// ✅ 1. Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 2. Add new student
exports.addStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add student' });
  }
};

// ✅ 3. Update student info
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// ✅ 4. Mark attendance by student ID
exports.markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendance = new Attendance({ studentId, date, status });
    await attendance.save();
    res.json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ message: 'Attendance failed' });
  }
};

// ✅ 5. Send attendance card via WhatsApp (Twilio)
exports.sendAttendanceCard = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student || !student.contact)
      return res.status(404).json({ message: 'Student or contact not found' });

    const attendanceRecords = await Attendance.find({ studentId });
    const summary = attendanceRecords
      .map(a => `📅 ${a.date} - ${a.status}`)
      .join('\n');

    const message = `📘 Attendance Report for ${student.name}\n\n${summary}`;

    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+17193503962', // Twilio sandbox number
      to: `whatsapp:+91${student.contact}`
    });

    res.json({ message: 'Attendance sent to parent', sid: response.sid });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send via WhatsApp' });
  }
};
