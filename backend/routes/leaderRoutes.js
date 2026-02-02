const express = require('express');
const {
  createLeader,
  getAllLeaders,
  getLeaderById,
  updateLeader,
  deleteLeader
} = require('../controllers/leaderController');

const router = express.Router();

// Rutas CRUD para líder
router.post('/', createLeader);
router.get('/', getAllLeaders);
router.get('/:id', getLeaderById);
router.put('/:id', updateLeader);
router.delete('/:id', deleteLeader);

module.exports = router;
