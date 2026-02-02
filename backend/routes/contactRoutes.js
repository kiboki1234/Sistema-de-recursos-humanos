const express = require('express');
const router = express.Router();
const { getAllMessages, createMessage, getMessageById, deleteMessage } = require('../controllers/contactController');

// Ruta para obtener todos los mensajes
router.get('/messages', getAllMessages);

// Ruta para enviar un mensaje
router.post('/messages', createMessage);

// Ruta para obtener un mensaje por ID
router.get('/messages/:id', getMessageById);

// Ruta para eliminar un mensaje por ID
router.delete('/messages/:id', deleteMessage);

module.exports = router;
