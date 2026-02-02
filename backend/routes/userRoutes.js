const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getAllLeaders, assignMemberToLeader, getDirective, uploadProfilePicture, getMandateHistory } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

// Rutas de gestión de usuarios (Controller maneja validaciones específicas de permisos)
router.post('/create', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), createUser);
router.put('/:id', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), updateUser);
router.delete('/:id', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), deleteUser);

// Obtener lista de líderes (para dropdowns)
router.get('/leaders', protect, authorize('strategic_coordinator', 'president', 'vice_president'), getAllLeaders);

// Obtener directiva actual
router.get('/directive', protect, authorize('strategic_coordinator', 'president', 'vice_president'), getDirective);
router.get('/mandates-history', protect, authorize('strategic_coordinator', 'president', 'vice_president'), getMandateHistory);


// Subir foto de perfil (Accesible para todos los usuarios autenticados)
const upload = multer({ storage });
router.post('/upload-photo', protect, upload.single('image'), uploadProfilePicture);

// Gestión de equipos por líderes
router.put('/assign-team', protect, authorize('leader'), assignMemberToLeader);

// Ver usuarios (Líderes también pueden ver su equipo y usuarios disponibles)
router.get('/all', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), getAllUsers);
router.get('/:id', protect, getUserById);


module.exports = router;
