const express = require('express');
const { createPractice, getAllPractices, getPracticeById, updatePractice, deletePractice } = require('../controllers/practiceController');
const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

// President, Vice President, Leader pueden crear/editar/eliminar prácticas
router.post('/create', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), createPractice);
router.put('/update/:id', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), updatePractice);
router.delete('/delete/:id', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), deletePractice);

// Todos pueden ver prácticas (calendario)
router.get('/all', getAllPractices);
router.get('/:id', getPracticeById);

module.exports = router;
