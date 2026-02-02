import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import Footer from "../common/Footer";
import API_BASE_URL from "../../api";

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Create Team State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: "", description: "" });

    // Add Member State
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Search States for Main View
    const [teamSearch, setTeamSearch] = useState("");
    const [teamMemberSearch, setTeamMemberSearch] = useState("");

    useEffect(() => {
        fetchMyTeams();
        fetchAvailableMembers();
    }, []);

    const fetchMyTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_BASE_URL}/api/teams/my-teams`, { headers });
            setTeams(response.data);
            if (response.data.length > 0 && !selectedTeam) {
                // Select first team by default if none selected
                // setSelectedTeam(response.data[0]); 
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const fetchAvailableMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            // We use the regular get all users, which returns all members for leaders now (both assigned and unassigned)
            // Ideally we filter this on frontend or backed. Controller returns filtered list already.
            const response = await axios.get(`${API_BASE_URL}/api/users/all`, { headers });
            setAvailableMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post(`${API_BASE_URL}/api/teams/create`, newTeam, { headers });
            setTeams([...teams, response.data.team]);
            setShowCreateModal(false);
            setNewTeam({ name: "", description: "" });
            alert("Equipo creado exitosamente");
        } catch (error) {
            alert(error.response?.data?.message || "Error al crear equipo");
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm("¿Seguro que deseas eliminar este equipo?")) return;
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.delete(`${API_BASE_URL}/api/teams/${teamId}`, { headers });
            setTeams(teams.filter(t => t._id !== teamId));
            if (selectedTeam?._id === teamId) setSelectedTeam(null);
            alert("Equipo eliminado");
        } catch (error) {
            alert("Error al eliminar equipo");
        }
    };

    const handleAddMember = async (memberId) => {
        if (!selectedTeam) return;
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.put(`${API_BASE_URL}/api/teams/add-member`, {
                teamId: selectedTeam._id,
                memberId
            }, { headers });

            // Update selected team with new member list
            const updatedTeam = response.data.team;

            // Allow immediate update of local state
            // Need to populate members manually or refetch. 
            // Backend returns team with ObjectIds in members array usually unless populated.
            // Let's refetch teams to be safe and simple
            await fetchMyTeams();

            // Update selected team reference
            setSelectedTeam(prev => ({ ...prev, members: [...prev.members, memberId] })); // Optimistic/Simple update
            // Actually better to find the new team in the fetched list
            const refreshedTeams = await axios.get(`${API_BASE_URL}/api/teams/my-teams`, { headers });
            setTeams(refreshedTeams.data);
            setSelectedTeam(refreshedTeams.data.find(t => t._id === selectedTeam._id));

            setShowAddMemberModal(false);
            alert("Miembro agregado");
        } catch (error) {
            alert(error.response?.data?.message || "Error al agregar miembro");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!selectedTeam) return;
        if (!window.confirm("¿Remover miembro del equipo?")) return;
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.put(`${API_BASE_URL}/api/teams/remove-member`, {
                teamId: selectedTeam._id,
                memberId
            }, { headers });

            // Refetch
            const response = await axios.get(`${API_BASE_URL}/api/teams/my-teams`, { headers });
            setTeams(response.data);
            setSelectedTeam(response.data.find(t => t._id === selectedTeam._id));

            alert("Miembro removido");
        } catch (error) {
            alert("Error al remover miembro");
        }
    };

    // Filter members for search (Modal Add User)
    const filteredMembers = availableMembers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtered lists for Main View
    const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()));

    const filteredTeamMembers = selectedTeam?.members?.filter(m =>
        m.name.toLowerCase().includes(teamMemberSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(teamMemberSearch.toLowerCase())
    ) || [];

    return (
        <>
            <div className="container mt-5 pt-4">
                <h1 className="mb-4">Gestión de Equipos</h1>
                <div className="row">
                    {/* Sidebar: List of Teams */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Mis Equipos</h5>
                                <Button variant="light" size="sm" onClick={() => setShowCreateModal(true)}>+</Button>
                            </div>
                            <div className="card-body p-2">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Buscar equipo..."
                                    value={teamSearch}
                                    onChange={(e) => setTeamSearch(e.target.value)}
                                />
                                <ul className="list-group list-group-flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {filteredTeams.map(team => (
                                        <li
                                            key={team._id}
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedTeam?._id === team._id ? 'active' : ''}`}
                                            onClick={() => setSelectedTeam(team)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div>
                                                <strong>{team.name}</strong>
                                                <div className="small opacity-75">{team.members.length} miembros</div>
                                            </div>
                                            <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team._id); }}>
                                                <i className="bi bi-trash"></i> X
                                            </Button>
                                        </li>
                                    ))}
                                    {filteredTeams.length === 0 && (
                                        <li className="list-group-item text-muted text-center py-4">
                                            No se encontraron equipos.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Team Details */}
                    <div className="col-md-8 mb-4">
                        {selectedTeam ? (
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="mb-0">{selectedTeam.name}</h4>
                                        <small className="text-muted">{selectedTeam.description}</small>
                                    </div>
                                    <Button variant="success" onClick={() => setShowAddMemberModal(true)}>
                                        + Agregar Miembro
                                    </Button>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="text-muted mb-0">Miembros del Equipo</h6>
                                        <input
                                            type="text"
                                            className="form-control w-50"
                                            placeholder="Buscar miembro en equipo..."
                                            value={teamMemberSearch}
                                            onChange={(e) => setTeamMemberSearch(e.target.value)}
                                        />
                                    </div>

                                    {filteredTeamMembers.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table align-middle">
                                                <tbody>
                                                    {filteredTeamMembers.map(member => (
                                                        <tr key={member._id}>
                                                            <td>
                                                                <div className="fw-bold">{member.name}</div>
                                                                <div className="small text-muted">{member.email}</div>
                                                            </td>
                                                            <td className="text-end">
                                                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveMember(member._id)}>
                                                                    Remover
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="alert alert-light text-center">
                                            No se encontraron miembros.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center p-5 text-muted">
                                <h5>Selecciona un equipo para ver detalles</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Create Team */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Equipo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateTeam}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Equipo</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTeam.name}
                                onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newTeam.description}
                                onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                            />
                        </Form.Group>
                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit">Crear</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal: Add Member */}
            <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Miembro a {selectedTeam?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="mb-3"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredMembers.map(member => (
                            <button
                                key={member._id}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => handleAddMember(member._id)}
                                disabled={selectedTeam?.members.some(m => m._id === member._id)}
                            >
                                <div>
                                    <div className="fw-bold">{member.name}</div>
                                    <div className="small text-muted">{member.email}</div>
                                </div>
                                {selectedTeam?.members.some(m => m._id === member._id) ? (
                                    <span className="badge bg-secondary">Ya en el equipo</span>
                                ) : (
                                    <span className="badge bg-primary">+ Agregar</span>
                                )}
                            </button>
                        ))}
                        {filteredMembers.length === 0 && (
                            <div className="text-center p-3 text-muted">No se encontraron miembros</div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
};

export default TeamManagement;
