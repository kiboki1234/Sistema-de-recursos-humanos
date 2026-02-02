const express = require('express');
const { createTeam, getMyTeams, addMember, removeMember, deleteTeam, getTeamById, getAllTeams } = require('../controllers/teamController');
const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/create', protect, authorize('leader'), createTeam);
router.get('/my-teams', protect, authorize('leader'), getMyTeams);
router.get('/all', protect, authorize('strategic_coordinator', 'president', 'vice_president'), getAllTeams);
router.get('/:id', protect, getTeamById); // New route to fetch specific team details
router.put('/add-member', protect, authorize('leader'), addMember);
router.put('/remove-member', protect, authorize('leader'), removeMember);
router.delete('/:id', protect, authorize('leader'), deleteTeam);

module.exports = router;
