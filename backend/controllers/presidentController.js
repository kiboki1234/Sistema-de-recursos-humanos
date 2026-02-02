const President = require('../models/President');

// Crear un presidente
exports.createPresident = async (req, res) => {
  try {
    const { assignedVicePresidents, assignedLeaders } = req.body;

    const newPresident = new President({ assignedVicePresidents, assignedLeaders });
    await newPresident.save();

    res.status(201).json({
      message: 'Presidente creado exitosamente',
      president: newPresident,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear presidente', error: error.message });
  }
};

// Obtener todos los presidentes
exports.getAllPresidents = async (req, res) => {
  try {
    const presidents = await President.find()
      .populate('assignedVicePresidents')
      .populate('assignedLeaders');
      
    res.status(200).json(presidents);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener presidentes', error: error.message });
  }
};

// Obtener un presidente por ID
exports.getPresidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const president = await President.findById(id)
      .populate('assignedVicePresidents')
      .populate('assignedLeaders');

    if (!president) {
      return res.status(404).json({ message: 'Presidente no encontrado' });
    }

    res.status(200).json(president);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener presidente', error: error.message });
  }
};

// Actualizar un presidente
exports.updatePresident = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedVicePresidents, assignedLeaders } = req.body;

    const updatedPresident = await President.findByIdAndUpdate(
      id,
      { assignedVicePresidents, assignedLeaders },
      { new: true }
    );

    if (!updatedPresident) {
      return res.status(404).json({ message: 'Presidente no encontrado' });
    }

    res.status(200).json({
      message: 'Presidente actualizado exitosamente',
      president: updatedPresident,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar presidente', error: error.message });
  }
};

// Eliminar un presidente
exports.deletePresident = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPresident = await President.findByIdAndDelete(id);

    if (!deletedPresident) {
      return res.status(404).json({ message: 'Presidente no encontrado' });
    }

    res.status(200).json({ message: 'Presidente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar presidente', error: error.message });
  }
};
