import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api';

const AssignedTasks = ({ handleShowModal }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError("No se encontró el token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks/assigned-to-user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error al obtener tareas asignadas:", error);
        setError("Error al cargar las tareas asignadas.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, []);

  return (
    <div className="col-md-6 mb-4">
      <h2>Tareas Asignadas para Mí</h2>
      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      <ul className="list-group">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{task.title}</h5>
                <p className="mb-0"><strong>Descripción:</strong> {task.description}</p>
                <p className="mb-0"><strong>Estado:</strong> {task.status}</p>
              </div>
              <button className="btn btn-info" onClick={() => handleShowModal(task)}>
                Ver Detalles
              </button>
            </li>
          ))
        ) : (
          !loading && <p className="text-muted">No tienes tareas asignadas.</p>
        )}
      </ul>
    </div>
  );
};

export default AssignedTasks;
