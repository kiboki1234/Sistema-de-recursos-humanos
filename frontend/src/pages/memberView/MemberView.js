import React, { useState, useEffect } from "react";
import CalendarComponent from "../pagesLeaderTH/CalendarComponent";
import AssignedTasks from "../TaskTracking/AssignedTasks";
import TaskDetailsModal from "../TaskTracking/TaskDetailsModal";
import axios from "axios";
import API_BASE_URL from "../../api";
import Footer from "../common/Footer";


const MemberView = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Obtener tareas desde el backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks/all`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  // Manejar el cambio de estado de la tarea
  const handleStatusChange = async (e) => {
    const updatedTask = { ...selectedTask, status: e.target.value };
    setSelectedTask(updatedTask);

    try {
      await axios.put(`${API_BASE_URL}/api/tasks/update/${selectedTask._id}`, updatedTask);
      setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };
  // Mostrar modal con detalles de tarea
  const handleShowModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-4 pt-4 flex-grow-1">
        <h1 className="mb-4 mt-4">Calendario de Practicas</h1>
        <CalendarComponent />
        <AssignedTasks tasks={tasks} handleShowModal={handleShowModal} />

      </div>
      <TaskDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        task={selectedTask}
        handleStatusChange={handleStatusChange}
      />
      <Footer />
    </div>

  );
}

export default MemberView;