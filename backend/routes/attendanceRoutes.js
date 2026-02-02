const express = require('express');
const {
  registerAttendance,
  getAllAttendances,
  getAttendancesByPractice,
  getAttendancesByUser,
  deleteAttendance
} = require('../controllers/attendanceController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// Registrar asistencia
router.post('/', protect, registerAttendance);

// Obtener todas las asistencias
router.get('/all', protect, getAllAttendances);

// Obtener asistencias por práctica
router.get('/practice/:practiceId', protect, getAttendancesByPractice);

// Obtener asistencias por usuario
router.get('/user/:userId', protect, getAttendancesByUser);

// Eliminar asistencia
router.delete('/:id', protect, deleteAttendance);

module.exports = router;
