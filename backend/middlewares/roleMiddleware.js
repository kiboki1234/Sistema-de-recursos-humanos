// Middleware para autorización basada en roles
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado (protect middleware debe ir primero)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'No autorizado. Debe iniciar sesión primero.'
      });
    }

    // Verificar que el usuario tenga uno de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `No tienes permisos para realizar esta acción. Rol requerido: ${allowedRoles.join(' o ')}`,
        yourRole: req.user.role
      });
    }

    next();
  };
};

module.exports = authorize;