import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api';

const AssignedByUserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError("No se encontró el token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks/assigned-by-user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error al obtener las tareas asignadas por el usuario:", error);
        setError("Error al cargar las tareas. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="col-md-6 mb-4">
      <h2>Tareas Asignadas por Mí</h2>
      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      <ul className="list-group">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id} className="list-group-item">
              <h5>{task.title}</h5>
              <p><strong>Asignado a:</strong> {task.assignedTo ? task.assignedTo.name : 'No asignado'}</p>
              <p><strong>Estado:</strong> {task.status}</p>
            </li>
          ))
        ) : (
          !loading && <p className="text-muted">No has asignado ninguna tarea.</p>
        )}
      </ul>
    </div>
  );
};

export default AssignedByUserTasks;
