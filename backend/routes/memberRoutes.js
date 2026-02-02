const express = require('express');
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember
} = require('../controllers/memberController');

const router = express.Router();

// Rutas CRUD para miembros
router.post('/', createMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
