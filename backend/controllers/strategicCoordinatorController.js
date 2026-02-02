const StrategicCoordinator = require('../models/StrategicCoordinator');

// Crear un coordinador estratégico
exports.createStrategicCoordinator = async (req, res) => {
  try {
    const { assignedPresidents, canCreateUsers } = req.body;

    const newCoordinator = new StrategicCoordinator({
      assignedPresidents,
      canCreateUsers: canCreateUsers !== undefined ? canCreateUsers : true,
    });

    await newCoordinator.save();

    res.status(201).json({
      message: 'Coordinador estratégico creado exitosamente',
      coordinator: newCoordinator,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear coordinador estratégico', error: error.message });
  }
};

// Obtener todos los coordinadores estratégicos
exports.getAllStrategicCoordinators = async (req, res) => {
  try {
    const coordinators = await StrategicCoordinator.find().populate('assignedPresidents');
    res.status(200).json(coordinators);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener coordinadores estratégicos', error: error.message });
  }
};

// Obtener un coordinador estratégico por ID
exports.getStrategicCoordinatorById = async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator = await StrategicCoordinator.findById(id).populate('assignedPresidents');

    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinador estratégico no encontrado' });
    }

    res.status(200).json(coordinator);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener coordinador estratégico', error: error.message });
  }
};

// Actualizar un coordinador estratégico
exports.updateStrategicCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedPresidents, canCreateUsers } = req.body;

    const updatedCoordinator = await StrategicCoordinator.findByIdAndUpdate(
      id,
      { assignedPresidents, canCreateUsers },
      { new: true }
    );

    if (!updatedCoordinator) {
      return res.status(404).json({ message: 'Coordinador estratégico no encontrado' });
    }

    res.status(200).json({
      message: 'Coordinador estratégico actualizado exitosamente',
      coordinator: updatedCoordinator,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar coordinador estratégico', error: error.message });
  }
};

// Eliminar un coordinador estratégico
exports.deleteStrategicCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoordinator = await StrategicCoordinator.findByIdAndDelete(id);

    if (!deletedCoordinator) {
      return res.status(404).json({ message: 'Coordinador estratégico no encontrado' });
    }

    res.status(200).json({ message: 'Coordinador estratégico eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar coordinador estratégico', error: error.message });
  }
};
