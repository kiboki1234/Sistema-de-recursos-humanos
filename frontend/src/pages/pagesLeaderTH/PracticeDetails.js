import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../../api";

const PracticeDetails = ({ practice, show, handleClose }) => {
    const [users, setUsers] = useState([]);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const token = localStorage.getItem('token');

    // Obtener la lista de usuarios y sus asistencias cuando se abre el modal
    useEffect(() => {
        const fetchUsersAndAttendances = async () => {
            try {
                // Consolidated Users Map to prevent duplicates
                const uniqueUsersMap = new Map();
                let usersToDisplay = [];

                // 1. Add Team Members (if applicable)
                if (practice.team && practice.team._id) {
                    try {
                        const teamResponse = await axios.get(`${API_BASE_URL}/api/teams/${practice.team._id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        (teamResponse.data.members || []).forEach(u => u && uniqueUsersMap.set(u._id, u));
                    } catch (teamError) {
                        console.error("Error fetching team:", teamError);
                        // Fallback? Maybe dont fallback to ALL users if we have assigned members.
                        // Only fallback to users/all if NO team and NO assigned members?
                        // Let's keep logic simple: If team fetch fails, we might miss team members.
                    }
                }

                // 2. Add Assigned Members (Individual)
                if (practice.assignedMembers && practice.assignedMembers.length > 0) {
                    practice.assignedMembers.forEach(u => {
                        if (u && typeof u === 'object') {
                            // If already exists (from team), overwrite or keep. logic is same user.
                            uniqueUsersMap.set(u._id, u);
                        }
                    });
                }

                // 3. Fallback: If map is empty and NO team/assigned set, load ALL users (Legacy/General practice)
                if (uniqueUsersMap.size === 0 && !practice.team && (!practice.assignedMembers || practice.assignedMembers.length === 0)) {
                    const usersResponse = await axios.get(`${API_BASE_URL}/api/users/all`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    (usersResponse.data || []).forEach(u => u && uniqueUsersMap.set(u._id, u));
                }

                // Obtener asistencias de la práctica
                const attendanceResponse = await axios.get(`${API_BASE_URL}/api/attendances/practice/${practice._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Mapear asistencias
                const attendanceMap = {};

                (attendanceResponse.data || []).forEach((attendance) => {
                    const attendedUser = attendance.user;
                    if (attendedUser) {
                        const userId = attendedUser._id || attendedUser;
                        attendanceMap[userId] = true;

                        // 4. Add Attendee if not in list (Guest/Extra)
                        if (!uniqueUsersMap.has(userId) && typeof attendedUser === 'object') {
                            uniqueUsersMap.set(userId, attendedUser);
                        }
                    }
                });

                // Convert Map to Array
                usersToDisplay = Array.from(uniqueUsersMap.values());

                setUsers(usersToDisplay);
                setAttendanceStatus(attendanceMap);
            } catch (error) {
                console.error("Error al obtener los usuarios o asistencias:", error);
                alert("Error cargando datos: " + error.message); // Temporary feedback
            }
        };

        if (show && practice) {
            fetchUsersAndAttendances();
        }
    }, [show, practice, token]);

    // Registrar asistencia de un usuario
    const handleRegisterAttendance = async (userId) => {
        try {
            await axios.post(
                `${API_BASE_URL}/api/attendances`,
                {
                    user: userId,
                    practice: practice._id,
                    attended: true,
                    checkInTime: new Date(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Actualizar el estado de asistencia en el frontend
            setAttendanceStatus((prevStatus) => ({
                ...prevStatus,
                [userId]: true
            }));
        } catch (error) {
            console.error("Error al registrar la asistencia:", error);
        }
    };

    // Descargar informes en formato PDF o Excel
    const downloadReport = async (type) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/documents/report/${type}/${practice._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: 'blob'
                }
            );

            // Crear un enlace de descarga dinámico
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `asistencia_${practice.title}.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(`Error al descargar el archivo ${type}:`, error);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!practice) return null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Práctica</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-control mb-2">
                    <p><strong>Título:</strong> {practice.title}</p>
                    <p><strong>Fecha:</strong> {new Date(practice.date).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {practice.startTime} - {practice.endTime}</p>
                    {practice.team && <p><strong>Equipo Asignado:</strong> <span className="badge bg-info">{practice.team.name}</span></p>}
                </div>
                <div className="form-control">
                    <h5>Lista de Asistencia {practice.team ? `(${practice.team.name})` : ""}</h5>

                    {/* Search Input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ul className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <li
                                key={user._id}
                                className={`list-group-item d-flex justify-content-between align-items-center 
                                    ${attendanceStatus[user._id] ? "bg-success text-white" : ""}
                                `}
                            >
                                {user.name}
                                <Button
                                    variant={attendanceStatus[user._id] ? "success" : "primary"}
                                    onClick={() => handleRegisterAttendance(user._id)}
                                    disabled={attendanceStatus[user._id]}
                                    size="sm"
                                >
                                    {attendanceStatus[user._id] ? "Presente" : "Marcar"}
                                </Button>
                            </li>
                        )) : (
                            <li className="list-group-item text-center">No hay miembros para listar</li>
                        )}
                    </ul>
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-danger" onClick={() => downloadReport('pdf')}>
                        Descargar PDF
                    </button>
                    <button className="btn btn-success" onClick={() => downloadReport('excel')}>
                        Descargar Excel
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PracticeDetails;
