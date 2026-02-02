const express = require('express');
const {
  createTask,
  getAllTasks,
  getTasksAssignedToUser,
  getTasksCreatedByUser,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

// Solo usuarios con rol de líder o superior pueden crear y eliminar tareas
router.post('/create', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), createTask);
router.delete('/delete/:id', protect, authorize('strategic_coordinator', 'president', 'vice_president', 'leader'), deleteTask);

// Todos los autenticados pueden ver y actualizar tareas
router.get('/all', protect, getAllTasks);
router.put('/update/:id', protect, updateTaskStatus);
router.get('/assigned-to/:userId', protect, getTasksAssignedToUser);
router.get('/assigned-by/:userId', protect, getTasksCreatedByUser);
router.get('/assigned-by-user', protect, getTasksCreatedByUser);
router.get('/assigned-to-user', protect, getTasksAssignedToUser);

module.exports = router;
