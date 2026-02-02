const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { User } = require('../models');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, student_id, phone } = req.body;

    if (!name || !email || !password || !role || !student_id || !phone) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = new User({ name, email, password, role, student_id, phone });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        isActive: newUser.isActive,
        profilePicture: newUser.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
