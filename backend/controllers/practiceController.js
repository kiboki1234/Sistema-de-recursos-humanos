const Practice = require('../models/Practice');

// Función para calcular la hora de finalización (+2 horas a la hora de inicio)
const calculateEndTime = (startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = (hours + 2) % 24;
  return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Crear una nueva práctica
exports.createPractice = async (req, res) => {
  try {
    const { title, date, startTime, team, assignedMembers } = req.body;

    if (!title || !date || !startTime) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const endTime = calculateEndTime(startTime);

    const newPractice = new Practice({
      title,
      date,
      startTime,
      endTime,
      team: team || null,
      assignedMembers: assignedMembers || []
    });

    await newPractice.save();

    res.status(201).json({ message: "Práctica creada exitosamente", practice: newPractice });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la práctica", error: error.message });
  }
};

// Obtener todas las prácticas
exports.getAllPractices = async (req, res) => {
  try {
    const practices = await Practice.find()
      .populate('team', 'name')
      .populate('assignedMembers', 'name email');
    res.status(200).json(practices);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las prácticas", error: error.message });
  }
};

// Obtener una práctica por ID
exports.getPracticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const practice = await Practice.findById(id)
      .populate('team', 'name')
      .populate('assignedMembers', 'name email role student_id phone'); // Populate full user info for details

    if (!practice) {
      return res.status(404).json({ message: "Práctica no encontrada" });
    }

    res.status(200).json(practice);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la práctica", error: error.message });
  }
};

// Actualizar una práctica
exports.updatePractice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPractice = await Practice.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPractice) {
      return res.status(404).json({ message: "Práctica no encontrada" });
    }

    res.status(200).json({ message: "Práctica actualizada exitosamente", practice: updatedPractice });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la práctica", error: error.message });
  }
};

// Eliminar una práctica
exports.deletePractice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPractice = await Practice.findByIdAndDelete(id);

    if (!deletedPractice) {
      return res.status(404).json({ message: "Práctica no encontrada" });
    }

    res.status(200).json({ message: "Práctica eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la práctica", error: error.message });
  }
};
