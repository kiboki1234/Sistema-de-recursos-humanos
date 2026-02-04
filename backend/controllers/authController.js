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

    // Verificar si la cuenta está bloqueada
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const waitTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(403).json({ message: `Cuenta bloqueada. Inténtalo de nuevo en ${waitTime} segundos` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Si supera los 3 intentos, bloquear por 30 segundos
      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = Date.now() + 30 * 1000;
        await user.save();
        return res.status(403).json({ message: 'Has excedido el número de intentos. Cuenta bloqueada por 30 segundos' });
      }

      await user.save();
      return res.status(401).json({ message: `Contraseña incorrecta. Intentos restantes: ${3 - user.failedLoginAttempts}` });
    }

    // Si el login es exitoso, reiniciar contadores
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

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
