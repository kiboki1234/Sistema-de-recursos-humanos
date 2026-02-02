const Leader = require('../models/Leader');

// Crear un líder
exports.createLeader = async (req, res) => {
  try {
    const { assignedMembers } = req.body;

    const newLeader = new Leader({
      assignedMembers
    });

    await newLeader.save();

    res.status(201).json({
      message: 'Líder creado exitosamente',
      leader: newLeader,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear líder', error: error.message });
  }
};

// Obtener todos los líderes
exports.getAllLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find().populate('assignedMembers');
    res.status(200).json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener líderes', error: error.message });
  }
};

// Obtener un líder por ID
exports.getLeaderById = async (req, res) => {
  try {
    const { id } = req.params;
    const leader = await Leader.findById(id).populate('assignedMembers');

    if (!leader) {
      return res.status(404).json({ message: 'Líder no encontrado' });
    }

    res.status(200).json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener líder', error: error.message });
  }
};

// Actualizar un líder
exports.updateLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedMembers } = req.body;

    const updatedLeader = await Leader.findByIdAndUpdate(
      id,
      { assignedMembers },
      { new: true }
    );

    if (!updatedLeader) {
      return res.status(404).json({ message: 'Líder no encontrado' });
    }

    res.status(200).json({
      message: 'Líder actualizado exitosamente',
      leader: updatedLeader,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar líder', error: error.message });
  }
};

// Eliminar un líder
exports.deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLeader = await Leader.findByIdAndDelete(id);

    if (!deletedLeader) {
      return res.status(404).json({ message: 'Líder no encontrado' });
    }

    res.status(200).json({ message: 'Líder eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar líder', error: error.message });
  }
};


