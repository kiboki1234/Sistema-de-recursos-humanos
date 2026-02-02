const express = require('express');
const {
  createVicePresident,
  getAllVicePresidents,
  getVicePresidentById,
  updateVicePresident,
  deleteVicePresident
} = require('../controllers/vicePresidentController');

const router = express.Router();

// Rutas CRUD para vicepresidente
router.post('/', createVicePresident);
router.get('/', getAllVicePresidents);
router.get('/:id', getVicePresidentById);
router.put('/:id', updateVicePresident);
router.delete('/:id', deleteVicePresident);

module.exports = router;
