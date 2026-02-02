const VicePresident = require('../models/VicePresident');

// Crear un vicepresidente
exports.createVicePresident = async (req, res) => {
  try {
    const { assignedLeaders } = req.body;

    const newVicePresident = new VicePresident({ assignedLeaders });
    await newVicePresident.save();

    res.status(201).json({
      message: 'Vicepresidente creado exitosamente',
      vicePresident: newVicePresident,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear vicepresidente', error: error.message });
  }
};

// Obtener todos los vicepresidentes
exports.getAllVicePresidents = async (req, res) => {
  try {
    const vicePresidents = await VicePresident.find().populate('assignedLeaders');
    res.status(200).json(vicePresidents);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener vicepresidentes', error: error.message });
  }
};

// Obtener un vicepresidente por ID
exports.getVicePresidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const vicePresident = await VicePresident.findById(id).populate('assignedLeaders');

    if (!vicePresident) {
      return res.status(404).json({ message: 'Vicepresidente no encontrado' });
    }

    res.status(200).json(vicePresident);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener vicepresidente', error: error.message });
  }
};

// Actualizar un vicepresidente
exports.updateVicePresident = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedLeaders } = req.body;

    const updatedVicePresident = await VicePresident.findByIdAndUpdate(
      id,
      { assignedLeaders },
      { new: true }
    );

    if (!updatedVicePresident) {
      return res.status(404).json({ message: 'Vicepresidente no encontrado' });
    }

    res.status(200).json({
      message: 'Vicepresidente actualizado exitosamente',
      vicePresident: updatedVicePresident,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar vicepresidente', error: error.message });
  }
};

// Eliminar un vicepresidente
exports.deleteVicePresident = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVicePresident = await VicePresident.findByIdAndDelete(id);

    if (!deletedVicePresident) {
      return res.status(404).json({ message: 'Vicepresidente no encontrado' });
    }

    res.status(200).json({ message: 'Vicepresidente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar vicepresidente', error: error.message });
  }
};
