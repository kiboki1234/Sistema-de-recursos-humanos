const express = require('express');
const {
  createPresident,
  getAllPresidents,
  getPresidentById,
  updatePresident,
  deletePresident
} = require('../controllers/presidentController');

const router = express.Router();

// Rutas CRUD para presidente
router.post('/', createPresident);
router.get('/', getAllPresidents);
router.get('/:id', getPresidentById);
router.put('/:id', updatePresident);
router.delete('/:id', deletePresident);

module.exports = router;
