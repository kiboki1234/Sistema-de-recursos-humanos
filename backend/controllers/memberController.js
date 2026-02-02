const Member = require('../models/Member');

// Crear un miembro
exports.createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();

    res.status(201).json({
      message: 'Miembro creado exitosamente',
      member: newMember,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear miembro', error: error.message });
  }
};

// Obtener todos los miembros
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener miembros', error: error.message });
  }
};

// Obtener un miembro por ID
exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener miembro', error: error.message });
  }
};

// Actualizar un miembro
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = await Member.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedMember) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }

    res.status(200).json({
      message: 'Miembro actualizado exitosamente',
      member: updatedMember,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar miembro', error: error.message });
  }
};

// Eliminar un miembro
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }

    res.status(200).json({ message: 'Miembro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar miembro', error: error.message });
  }
};
