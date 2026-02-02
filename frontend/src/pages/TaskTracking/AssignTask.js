import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api';
import { AuthContext } from '../../components/AuthContext';

const AssignTask = ({ handleAssignTask }) => {
  const { userRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response;
        if (userRole === 'president' || userRole === 'strategic_coordinator') {
          response = await axios.get(`${API_BASE_URL}/api/users/all`);
        } else if (userRole === 'vice_president') {
          response = await axios.get(`${API_BASE_URL}/api/users/all?role=leader`);
        } else if (userRole === 'leader') {
          response = await axios.get(`${API_BASE_URL}/api/users/all?role=member`);
        }
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error.response ? error.response.data : error.message);
      }
    };
    

    fetchUsers();
  }, [userRole]);
  return (
    <div className="col-md-6 mb-4">
      <h2>Asignar Tarea</h2>
      <form onSubmit={handleAssignTask} className="form-control">
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label">Título</label>
          <input type="text" id="taskTitle" name="taskTitle" className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="taskDescription" className="form-label">Descripción</label>
          <textarea id="taskDescription" name="taskDescription" rows="3" className="form-control" required></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="assignedTo" className="form-label">Asignar a</label>
          <select id="assignedTo" name="assignedTo" className="form-control" required>
            <option value="">Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Asignar Tarea</button>
      </form>
    </div>
  );
};

export default AssignTask;