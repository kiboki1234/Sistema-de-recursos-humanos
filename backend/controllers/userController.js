const User = require('../models/User');
const StrategicCoordinator = require('../models/StrategicCoordinator');
const President = require('../models/President');
const VicePresident = require('../models/VicePresident');
const Leader = require('../models/Leader');
const Member = require('../models/Member');
const bcrypt = require('bcryptjs');

// ========== PERMISSION HELPER FUNCTIONS ==========

// Check if deleter can delete target based on role hierarchy
function checkDeletionPermission(deleterRole, targetRole) {
  const permissions = {
    strategic_coordinator: ['president', 'vice_president', 'leader', 'member'],
    president: ['vice_president', 'leader', 'member'],
    vice_president: ['leader', 'member'],
    leader: ['member'],
    member: []
  };

  return permissions[deleterRole]?.includes(targetRole) || false;
}

// Get user visibility roles based on current user's role
function getUserVisibilityRoles(role) {
  const visibility = {
    strategic_coordinator: ['strategic_coordinator', 'president', 'vice_president', 'leader', 'member'],
    president: ['president', 'vice_president', 'leader', 'member'],
    vice_president: ['vice_president', 'leader', 'member'],
    leader: ['leader', 'member'],
    member: ['member']
  };

  return visibility[role] || ['member'];
}

// Get display name for roles
function getRoleDisplayName(role) {
  const roleNames = {
    strategic_coordinator: 'Coordinador Estratégico',
    president: 'Presidente',
    vice_president: 'Vicepresidente',
    leader: 'Líder',
    member: 'Miembro'
  };

  return roleNames[role] || role;
}

// Check for existing active user in single-occupancy roles
async function getConflictingActiveUser(role, excludeUserId = null) {
  const uniqueRoles = ['strategic_coordinator', 'president', 'vice_president'];
  if (!uniqueRoles.includes(role)) return null;

  const query = { role: role, isActive: true };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  return await User.findOne(query);
}

// ========== USER CRUD OPERATIONS ==========

// Crear un nuevo usuario y guardarlo en la colección correspondiente
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, student_id, phone, assignedLeader, isActive, period } = req.body;

    if (!name || !email || !password || !role || !student_id || !phone) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe en la colección User
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Check Single Active Role Constraint
    const isNewUserActive = isActive !== false; // Default true if not specified
    if (isNewUserActive) {
      const conflictingUser = await getConflictingActiveUser(role);
      if (conflictingUser) {
        return res.status(400).json({
          message: `Ya existe un ${getRoleDisplayName(role)} activo (${conflictingUser.name}). Debe desactivarlo antes de asignar uno nuevo para este periodo.`
        });
      }
    }

    // Crear usuario en la colección general
    const newUser = new User({
      name,
      email,
      password, // Se guardará en texto plano y el middleware la hasheará
      role,
      student_id,
      role,
      student_id,
      phone,
      assignedLeader: assignedLeader || null, // Asignar líder si se proporciona
      isActive: isActive !== undefined ? isActive : true,
      period: period || null
    });
    await newUser.save();

    // Guardar el usuario en la colección correspondiente a su rol
    let roleSpecificUser;
    switch (role) {
      case 'strategic_coordinator':
        roleSpecificUser = new StrategicCoordinator({ _id: newUser._id });
        break;
      case 'president':
        roleSpecificUser = new President({ _id: newUser._id });
        break;
      case 'vice_president':
        roleSpecificUser = new VicePresident({ _id: newUser._id });
        break;
      case 'leader':
        roleSpecificUser = new Leader({ _id: newUser._id });
        break;
      case 'member':
        roleSpecificUser = new Member({ _id: newUser._id });
        break;
      default:
        // Clean up user if role is invalid
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({ message: "Rol inválido" });
    }

    await roleSpecificUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Obtener todos los usuarios (filtered by role permissions)
exports.getAllUsers = async (req, res) => {
  try {
    const currentUser = req.user;

    // Si es líder, ve a sus miembros asignados Y a los miembros sin asignar
    if (currentUser.role === 'leader') {
      const visibleMembers = await User.find({
        role: 'member',
        $or: [
          { assignedLeader: currentUser.id },
          { assignedLeader: null },
          { assignedLeader: { $exists: false } }
        ]
      })
        .populate('assignedLeader', 'name')
        .select('-password');
      return res.status(200).json(visibleMembers);
    }

    // Get allowed roles based on current user's role
    const allowedRoles = getUserVisibilityRoles(currentUser.role);

    // Fetch users with allowed roles, exclude password
    const users = await User.find({
      role: { $in: allowedRoles }
    })
      .populate('assignedLeader', 'name') // Populate leader name if exists
      .select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Endpoint específico para que líderes gestionen su equipo
exports.assignMemberToLeader = async (req, res) => {
  try {
    const { memberId } = req.body;
    const { action } = req.body; // 'add' or 'remove'
    const currentUser = req.user;

    if (currentUser.role !== 'leader') {
      return res.status(403).json({ message: "Solo los líderes pueden gestionar equipos" });
    }

    const member = await User.findById(memberId);
    if (!member || member.role !== 'member') {
      return res.status(404).json({ message: "Miembro no encontrado o inválido" });
    }

    if (action === 'add') {
      // Solo puede agregar si no tiene líder
      if (member.assignedLeader && member.assignedLeader.toString() !== currentUser.id) {
        return res.status(400).json({ message: "Este miembro ya tiene un equipo asignado" });
      }
      member.assignedLeader = currentUser.id;
    } else if (action === 'remove') {
      // Solo puede remover si es SU miembro
      if (member.assignedLeader && member.assignedLeader.toString() === currentUser.id) {
        member.assignedLeader = null;
      } else {
        return res.status(403).json({ message: "No puedes remover un miembro que no es de tu equipo" });
      }
    } else {
      return res.status(400).json({ message: "Acción inválida" });
    }

    await member.save();
    res.status(200).json({ message: "Equipo actualizado exitosamente", member });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar equipo", error: error.message });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, student_id, phone, assignedLeader, isActive, period } = req.body;

    // Validate Status Logic
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) return res.status(404).json({ message: "Usuario no encontrado" });

    const newRole = role || userToUpdate.role;
    const newActiveState = isActive !== undefined ? isActive : userToUpdate.isActive;

    if (newActiveState) {
      const conflictingUser = await getConflictingActiveUser(newRole, id);
      if (conflictingUser) {
        return res.status(400).json({
          message: `Ya existe un ${getRoleDisplayName(newRole)} activo (${conflictingUser.name}). No se puede activar este usuario.`
        });
      }
    }

    // Actualizar en la colección User
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, student_id, phone, assignedLeader, isActive, period },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado exitosamente", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// Nuevo endpoint para obtener solo líderes (para dropdowns)
exports.getAllLeaders = async (req, res) => {
  try {
    const leaders = await User.find({ role: 'leader' }).select('name _id');
    res.status(200).json(leaders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener líderes", error: error.message });
  }
};

// Obtener la directiva actual (Usuarios activos de alto rango)
exports.getDirective = async (req, res) => {
  try {
    const coordinator = await User.findOne({ role: 'strategic_coordinator', isActive: true }).select('name email phone role student_id profilePicture');
    const president = await User.findOne({ role: 'president', isActive: true }).select('name email phone role student_id profilePicture');
    const vicePresident = await User.findOne({ role: 'vice_president', isActive: true }).select('name email phone role student_id profilePicture');
    const leaders = await User.find({ role: 'leader', isActive: true }).select('name email phone role student_id profilePicture');

    res.status(200).json({
      strategic_coordinator: coordinator,
      president: president,
      vice_president: vicePresident,
      leaders: leaders
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la directiva actual", error: error.message });
  }
};

// Obtener historial de mandatos (Usuarios inactivos de roles directivos)
exports.getMandateHistory = async (req, res) => {
  try {
    const history = await User.find({
      role: { $in: ['strategic_coordinator', 'president', 'vice_president'] },
      isActive: false // Solo usuarios inactivos (pasados)
    })
      .sort({ createdAt: -1 }) // Ordenados por fecha de creación (aproximación a periodo)
      .select('name role period createdAt email');

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el historial", error: error.message });
  }
};

// Subir Foto de Perfil
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ninguna imagen" });
    }

    const userId = req.user.id;
    const imageUrl = req.file.path; // Cloudinary devuelve la URL en path

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al subir la imagen", error: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  // ... existing code ...
  try {
    const { id } = req.params;
    const currentUser = req.user; // From auth middleware

    // Rule 1: Cannot delete yourself
    if (id === currentUser.id) {
      return res.status(403).json({
        message: "No puedes eliminarte a ti mismo"
      });
    }

    // Get target user first
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Rule 2: Role-based deletion permissions
    const canDelete = checkDeletionPermission(currentUser.role, targetUser.role);
    if (!canDelete) {
      return res.status(403).json({
        message: `No tienes permisos para eliminar a un usuario con rol de ${getRoleDisplayName(targetUser.role)}`
      });
    }

    // Eliminar usuario de la colección User
    const deletedUser = await User.findByIdAndDelete(id);

    // Eliminar de la colección correspondiente a su rol
    switch (deletedUser.role) {
      case 'strategic_coordinator':
        await StrategicCoordinator.findByIdAndDelete(id);
        break;
      case 'president':
        await President.findByIdAndDelete(id);
        break;
      case 'vice_president':
        await VicePresident.findByIdAndDelete(id);
        break;
      case 'leader':
        await Leader.findByIdAndDelete(id);
        break;
      case 'member':
        await Member.findByIdAndDelete(id);
        break;
    }

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};
