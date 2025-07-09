router.get('/students', getAllStudents);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.post('/attendance', markAttendance);
router.get('/attendance/whatsapp/:studentId', sendAttendanceCard);
