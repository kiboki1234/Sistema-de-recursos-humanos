const express = require('express');
const {
  createStrategicCoordinator,
  getAllStrategicCoordinators,
  getStrategicCoordinatorById,
  updateStrategicCoordinator,
  deleteStrategicCoordinator
} = require('../controllers/strategicCoordinatorController');

const router = express.Router();

// Rutas CRUD para coordinador estratégico
router.post('/', createStrategicCoordinator);
router.get('/', getAllStrategicCoordinators);
router.get('/:id', getStrategicCoordinatorById);
router.put('/:id', updateStrategicCoordinator);
router.delete('/:id', deleteStrategicCoordinator);

module.exports = router;
