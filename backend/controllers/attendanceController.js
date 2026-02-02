const Attendance = require('../models/Attendance');
const Practice = require('../models/Practice');
const User = require('../models/User');

// Registrar asistencia
exports.registerAttendance = async (req, res) => {
  try {
    const { user, practice, attended, checkInTime } = req.body;

    if (!user || !practice) {
      return res.status(400).json({ message: 'Usuario y práctica son obligatorios' });
    }

    // Verificar si la práctica existe
    const existingPractice = await Practice.findById(practice);
    if (!existingPractice) {
      return res.status(404).json({ message: 'Práctica no encontrada' });
    }

    // Verificar si el usuario existe
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la asistencia ya ha sido registrada
    const existingAttendance = await Attendance.findOne({ user, practice });
    if (existingAttendance) {
      return res.status(400).json({ message: 'La asistencia ya ha sido registrada para este usuario' });
    }

    const newAttendance = new Attendance({
      user,
      practice,
      attended,
      checkInTime
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Asistencia registrada exitosamente', attendance: newAttendance });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
  }
};

// Obtener todas las asistencias
exports.getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate('user', 'name email')
      .populate('practice', 'title date startTime endTime');
    
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asistencias', error: error.message });
  }
};

// Obtener asistencias por práctica
exports.getAttendancesByPractice = async (req, res) => {
  try {
    const { practiceId } = req.params;

    const attendances = await Attendance.find({ practice: practiceId })
      .populate('user', 'name email')
      .populate('practice', 'title date startTime endTime');

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asistencias por práctica', error: error.message });
  }
};

// Obtener asistencias por usuario
exports.getAttendancesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const attendances = await Attendance.find({ user: userId })
      .populate('user', 'name email')
      .populate('practice', 'title date startTime endTime');

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asistencias por usuario', error: error.message });
  }
};

// Eliminar una asistencia
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    res.status(200).json({ message: 'Asistencia eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar asistencia', error: error.message });
  }
};
