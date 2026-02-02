const { verifyToken } = require('../config/jwt');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso no autorizado, token no encontrado o inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Token inválido, información insuficiente' });
    }

    req.user = decoded; // Decodifica el id y el role
    next();
  } catch (error) {
    console.error('Error de verificación de token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = protect;
