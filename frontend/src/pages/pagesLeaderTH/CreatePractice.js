import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../../api";
import { AuthContext } from "../../components/AuthContext";

const CreatePractice = () => {
    const { userRole } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        startTime: "",
        team: "",
        assignedMembers: [] // Array of user IDs
    });
    const [teams, setTeams] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]); // All users for selection
    const [searchTerm, setSearchTerm] = useState(""); // Search filter
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch teams based on role
    useEffect(() => {
        if (userRole === 'leader') {
            fetchMyTeams();
        } else if (['strategic_coordinator', 'president', 'vice_president'].includes(userRole)) {
            fetchAllTeams();
        }

        // Fetch all users to allow individual assignment
        fetchAllUsers();
    }, [userRole]);

    const fetchMyTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_BASE_URL}/api/teams/my-teams`, { headers });
            setTeams(response.data || []);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const fetchAllTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_BASE_URL}/api/teams/all`, { headers });
            setTeams(response.data || []);
        } catch (error) {
            console.error("Error fetching all teams:", error);
        }
    };

    const fetchAllUsers = async () => {
        setLoadingUsers(true);
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_BASE_URL}/api/users/all`, { headers });
            setAvailableUsers((response.data || []).filter(u => u.role === 'member')); // Only show MEMBERS for assignment
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleMemberToggle = (userId) => {
        setFormData(prev => {
            const currentMembers = prev.assignedMembers;
            if (currentMembers.includes(userId)) {
                return { ...prev, assignedMembers: currentMembers.filter(id => id !== userId) };
            } else {
                return { ...prev, assignedMembers: [...currentMembers, userId] };
            }
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.startTime) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const endTime = calculateEndTime(formData.startTime);
        const practiceData = {
            ...formData,
            endTime
        };

        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post(`${API_BASE_URL}/api/practices/create`, practiceData, { headers });
            setSuccessMessage(response.data.message);
            setFormData({
                title: "",
                date: "",
                startTime: "",
                team: "",
                assignedMembers: []
            });

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error al crear práctica:", error);
            alert("Error al crear práctica: " + (error.response?.data?.message || error.message));
        }
    };

    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const endHours = (hours + 2) % 24;
        return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const canAssignTeams = ['leader', 'strategic_coordinator', 'president', 'vice_president'].includes(userRole);

    return (
        <div className="card mb-4">
            <div className="card-header bg-warning text-white">Crear Nueva Práctica</div>
            <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Título</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="startTime" className="form-label">Hora de Inicio</label>
                        <input
                            type="time"
                            className="form-control"
                            id="startTime"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            required
                        />
                    </div>

                    {/* Team Selection */}
                    {canAssignTeams && (
                        <div className="mb-3">
                            <label htmlFor="team" className="form-label">Asignar a Equipo (Opcional)</label>
                            <select
                                className="form-select"
                                id="team"
                                value={formData.team}
                                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                            >
                                <option value="">-- General (Sin Equipo) --</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>
                                        {team.name} {userRole !== 'leader' ? `(Líder: ${team.leader?.name || 'N/A'})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Individual Member Selection */}
                    <div className="mb-3">
                        <label className="form-label">Asignar Miembros Individuales (Opcional)</label>

                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Buscar miembro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="card" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            <div className="card-body p-2">
                                {loadingUsers ? <p>Cargando usuarios...</p> : (
                                    availableUsers
                                        .filter(user =>
                                            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .length > 0 ? (
                                        availableUsers
                                            .filter(user =>
                                                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(user => (
                                                <div key={user._id} className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={user._id}
                                                        id={`user-${user._id}`}
                                                        checked={formData.assignedMembers.includes(user._id)}
                                                        onChange={() => handleMemberToggle(user._id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`user-${user._id}`}>
                                                        {user.name} ({user.email})
                                                    </label>
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-muted">No se encontraron miembros.</p>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="form-text">
                            Puedes seleccionar miembros específicos adicionales.
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success">Crear Práctica</button>
                </form>
            </div >
        </div >
    );
};

export default CreatePractice;
