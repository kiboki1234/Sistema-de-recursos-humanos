const Task = require('../models/Task');

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body);

    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Obtener el usuario autenticado desde el middleware
    const createdBy = req.user.id;

    if (!createdBy) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      createdBy
    });

    await newTask.save();
    res.status(201).json({ message: "Tarea creada exitosamente", task: newTask });

  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({ message: "Error al crear la tarea", error: error.message });
  }
};




// Obtener todas las tareas
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas", error: error.message });
  }
};

// Obtener tareas asignadas a un usuario específico
exports.getTasksAssignedToUser = async (req, res) => {
  try {
    const userId = req.user.id;  // El ID se obtiene del token en authMiddleware
    const tasks = await Task.find({ assignedTo: userId }).populate('createdBy', 'name email');
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas asignadas", error: error.message });
  }
};


// Obtener tareas creadas por un usuario específico
exports.getTasksCreatedByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Se obtiene del middleware de autenticación
    const tasks = await Task.find({ createdBy: userId }).populate('assignedTo', 'name email');
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas asignadas", error: error.message });
  }
};


// Actualizar el estado de una tarea
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Estado de tarea actualizado", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
  }
};
