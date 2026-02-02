const ContactMessage = require('../models/Contact');

// Obtener todos los mensajes de contacto
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes', error: error.message });
  }
};

// Crear un nuevo mensaje de contacto
exports.createMessage = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newMessage = new ContactMessage({ name, phone, message });
    await newMessage.save();

    res.status(201).json({ message: "Mensaje enviado correctamente", newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el mensaje', error: error.message });
  }
};

// Obtener un mensaje por ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el mensaje', error: error.message });
  }
};

// Eliminar un mensaje por ID
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }
    res.status(200).json({ message: "Mensaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mensaje', error: error.message });
  }
};
