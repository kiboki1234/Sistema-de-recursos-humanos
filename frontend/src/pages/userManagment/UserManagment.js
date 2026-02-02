import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Modal, Pagination, Alert, InputGroup, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Footer from "../common/Footer";
import API_BASE_URL from "../../api";

const UserManagement = ({ includeFooter = true }) => {
    const [users, setUsers] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Create State
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        student_id: "",
        phone: "",
        assignedLeader: "",
        isActive: true
    });

    // Delete State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Edit State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (currentUser && ['strategic_coordinator', 'president', 'vice_president'].includes(currentUser.role)) {
            fetchLeaders();
        }
    }, [currentUser]);

    const fetchCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
    };

    const fetchLeaders = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_BASE_URL}/api/users/leaders`, { headers });
            setLeaders(response.data);
        } catch (error) {
            console.error("Error al obtener líderes:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`${API_BASE_URL}/api/users/all`, { headers });
            setUsers(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    // --- CREATE LOGIC ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser({ ...newUser, [name]: type === 'checkbox' ? checked : value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const userData = { ...newUser };
            if (userData.role !== 'member' || userData.assignedLeader === "") {
                delete userData.assignedLeader;
            }

            const response = await axios.post(`${API_BASE_URL}/api/users/create`, userData, { headers });
            setUsers([...users, response.data.user]);
            setNewUser({
                name: "",
                email: "",
                password: "",
                role: "",
                student_id: "",
                phone: "",
                assignedLeader: "",
                isActive: true
            });
            alert("Usuario creado exitosamente");
        } catch (error) {
            console.error("Error al crear usuario:", error);
            alert(error.response?.data?.message || "Error al crear usuario");
        }
    };

    // --- DELETE LOGIC ---
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.delete(`${API_BASE_URL}/api/users/${userToDelete._id}`, { headers });
            setUsers(users.filter(u => u._id !== userToDelete._id));
            setShowDeleteModal(false);
            setUserToDelete(null);
            alert("Usuario eliminado exitosamente");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert(error.response?.data?.message || "Error al eliminar usuario");
            setShowDeleteModal(false);
        }
    };

    // --- EDIT LOGIC ---
    const handleEditClick = (user) => {
        setEditingUser({
            ...user,
            assignedLeader: user.assignedLeader ? user.assignedLeader._id : ""
        });
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingUser({ ...editingUser, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const userData = { ...editingUser };
            if (userData.role !== 'member' || userData.assignedLeader === "") {
                userData.assignedLeader = null;
            }

            const response = await axios.put(`${API_BASE_URL}/api/users/${editingUser._id}`, userData, { headers });

            setUsers(users.map(u => u._id === editingUser._id ? response.data.user : u));
            setShowEditModal(false);
            setEditingUser(null);
            alert("Usuario actualizado exitosamente");
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert(error.response?.data?.message || "Error al actualizar usuario");
        }
    };

    // --- TEAM MANAGEMENT LOGIC (LEADER) ---
    const handleTeamAction = async (user, action) => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.put(
                `${API_BASE_URL}/api/users/assign-team`,
                { memberId: user._id, action },
                { headers }
            );

            // Update local state by refetching or manually updating
            // Manually updating is tricky because we need the full user object including populated leader
            // But verify what backend returns. It returns { message, member }. assignedLeader might be ID.

            // Safer to refetch users to ensure populated fields are correct
            fetchUsers();

            alert(action === 'add' ? "Miembro agregado al equipo" : "Miembro removido del equipo");
        } catch (error) {
            console.error("Error al gestionar equipo:", error);
            alert(error.response?.data?.message || "Error al gestionar equipo");
        }
    };

    // --- PERMISSIONS ---
    const canManage = (targetUserRole) => {
        if (!currentUser) return false;
        // Leader has special UI, handled separately
        if (currentUser.role === 'leader') return false;

        const permissions = {
            strategic_coordinator: ['strategic_coordinator', 'president', 'vice_president', 'leader', 'member'],
            president: ['vice_president', 'leader', 'member'],
            vice_president: ['leader', 'member'],
            leader: [], // Leader standard management disabled
            member: []
        };
        return permissions[currentUser.role]?.includes(targetUserRole) || false;
    };

    const isLeader = currentUser?.role === 'leader';
    const isSelf = (userId) => currentUser && userId === currentUser.id;

    // --- UTILS ---
    const getRoleDisplayName = (role) => {
        const roleNames = {
            strategic_coordinator: 'Coordinador Estratégico',
            president: 'Presidente',
            vice_president: 'Vicepresidente',
            leader: 'Líder',
            member: 'Miembro'
        };
        return roleNames[role] || role;
    };

    const getRoleBadgeClass = (role) => {
        const badgeClasses = {
            strategic_coordinator: 'badge bg-danger',
            president: 'badge bg-primary',
            vice_president: 'badge bg-info',
            leader: 'badge bg-success',
            member: 'badge bg-secondary'
        };
        return badgeClasses[role] || 'badge bg-secondary';
    };

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoleDisplayName(user.role).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    // Reset pagination when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // --- EXPORT FUNCTION ---
    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        // Prepare data for export (flatten structure if needed)
        const exportData = users.map(user => ({
            Nombre: user.name,
            Email: user.email,
            Rol: getRoleDisplayName(user.role),
            Teléfono: user.phone,
            "ID Estudiante": user.student_id,
            Estado: user.isActive !== false ? "Activo" : "Inactivo",
            "Líder Asignado": user.assignedLeader ? user.assignedLeader.name : "N/A"
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = { Sheets: { 'Usuarios': ws }, SheetNames: ['Usuarios'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });

        const fileName = `Reporte_Usuarios_${new Date().toISOString().slice(0, 10)} `;
        saveAs(data, fileName + fileExtension);
    };

    return (
        <>
            <Container className={includeFooter ? "mt-5 pt-5 flex-grow-1" : ""}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">{isLeader ? "Gestión de Mi Equipo" : "Gestión de Usuarios"}</h1>
                    {!isLeader && (
                        <Button variant="success" onClick={exportToExcel}>
                            <i className="bi bi-file-earmark-excel me-2"></i>Exportar Excel
                        </Button>
                    )}
                </div>
                <div className="row">
                    {/* Panel de Creación - Oculto para Líderes */}
                    {!isLeader && (
                        <div className="col-md-5 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">Crear Nuevo Usuario</h5>
                                </div>
                                <div className="card-body">
                                    <Form onSubmit={handleCreateUser}>
                                        <Form.Control type="text" name="name" placeholder="Nombre Completo" value={newUser.name} onChange={handleInputChange} className="mb-3" required />
                                        <Form.Control type="email" name="email" placeholder="Correo Electrónico" value={newUser.email} onChange={handleInputChange} className="mb-3" required />
                                        <Form.Control type="password" name="password" placeholder="Contraseña" value={newUser.password} onChange={handleInputChange} className="mb-3" required />

                                        <Form.Select name="role" value={newUser.role} onChange={handleInputChange} className="mb-3" required>
                                            <option value="">Seleccionar Rol</option>
                                            {currentUser?.role === 'strategic_coordinator' && <option value="president">Presidente</option>}
                                            {['strategic_coordinator', 'president'].includes(currentUser?.role) && <option value="vice_president">Vicepresidente</option>}
                                            {['strategic_coordinator', 'president', 'vice_president'].includes(currentUser?.role) && <option value="leader">Líder</option>}
                                            <option value="member">Miembro</option>
                                        </Form.Select>

                                        {newUser.role === 'member' && (
                                            <Form.Select name="assignedLeader" value={newUser.assignedLeader} onChange={handleInputChange} className="mb-3">
                                                <option value="">Seleccionar Líder (Opcional)</option>
                                                {leaders.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                                            </Form.Select>
                                        )}

                                        <Form.Control type="text" name="student_id" placeholder="ID de Estudiante" value={newUser.student_id} onChange={handleInputChange} className="mb-3" required />
                                        <Form.Control type="text" name="phone" placeholder="Teléfono" value={newUser.phone} onChange={handleInputChange} className="mb-3" required />

                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label={newUser.isActive ? "Usuario Activo" : "Usuario Inactivo"}
                                            name="isActive"
                                            checked={newUser.isActive}
                                            onChange={handleInputChange}
                                            className="mb-3"
                                            disabled={currentUser?.role !== 'strategic_coordinator' && ['president', 'vice_president', 'strategic_coordinator'].includes(newUser.role)}
                                        />

                                        <Button type="submit" className="w-100" variant="primary">Crear Usuario</Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de Usuarios - Full width para Líderes */}
                    <div className={isLeader ? "col-12 mb-4" : "col-md-7 mb-4"}>
                        <div className="card shadow-sm">
                            <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{isLeader ? "Miembros Disponibles y Equipo" : "Usuarios Existentes"}</h5>
                            </div>
                            <div className="card-body">
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Buscar por nombre, email o rol..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {filteredUsers.length > 0 ? (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Nombre/Email</th>
                                                        <th>Rol / Equipo</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentUsers.map(user => (
                                                        <tr key={user._id}>
                                                            <td>
                                                                <div className="fw-bold">{user.name}
                                                                    {user.isActive === false && <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>Inactivo</span>}
                                                                </div>
                                                                <div className="text-muted small">{user.email}</div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex flex-column gap-1">
                                                                    <span className={getRoleBadgeClass(user.role)}>
                                                                        {getRoleDisplayName(user.role)}
                                                                    </span>
                                                                    {user.assignedLeader && (
                                                                        <span className={`badge ${user.assignedLeader._id === currentUser?._id ? 'bg-success' : 'bg-light text-dark border'} `}>
                                                                            {user.assignedLeader._id === currentUser?._id ? "En mi equipo" : `Líder: ${user.assignedLeader.name} `}
                                                                        </span>
                                                                    )}
                                                                    {!user.assignedLeader && user.role === 'member' && (
                                                                        <span className="badge bg-warning text-dark">Sin Asignar</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {/* Standard Management Actions */}
                                                                {canManage(user.role) && (
                                                                    <div className="d-flex gap-2">
                                                                        {/* Allow Edit if not self OR if self and is Strategic Coordinator */}
                                                                        {(!isSelf(user._id) || (isSelf(user._id) && currentUser.role === 'strategic_coordinator')) && (
                                                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(user)}>
                                                                                Editar
                                                                            </Button>
                                                                        )}

                                                                        {/* Delete never allowed for self */}
                                                                        {!isSelf(user._id) && (
                                                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}>
                                                                                Eliminar
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Leader Specific Actions */}
                                                                {isLeader && user.role === 'member' && !isSelf(user._id) && (
                                                                    <div className="d-flex gap-2">
                                                                        {(!user.assignedLeader || (user.assignedLeader._id || user.assignedLeader) !== currentUser._id) && !user.assignedLeader ? (
                                                                            <Button variant="success" size="sm" onClick={() => handleTeamAction(user, 'add')}>
                                                                                + Agregar a mi equipo
                                                                            </Button>
                                                                        ) : (user.assignedLeader && (user.assignedLeader._id === currentUser._id || user.assignedLeader === currentUser._id)) ? (
                                                                            <Button variant="outline-danger" size="sm" onClick={() => handleTeamAction(user, 'remove')}>
                                                                                Remover de mi equipo
                                                                            </Button>
                                                                        ) : (
                                                                            <span className="text-muted small">De otro equipo</span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {isSelf(user._id) && currentUser.role !== 'strategic_coordinator' && <span className="text-muted small">Tú mismo</span>}
                                                                {!canManage(user.role) && !isLeader && !isSelf(user._id) && <span className="text-muted small">Sin permisos</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="d-flex justify-content-center mt-3">
                                                <Pagination>
                                                    <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                                                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                                    {[...Array(totalPages)].map((_, index) => (
                                                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                                            {index + 1}
                                                        </Pagination.Item>
                                                    ))}
                                                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                                    <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                                                </Pagination>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted text-center">No hay usuarios registrados.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Modal de Edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingUser && (
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" name="name" value={editingUser.name} onChange={handleEditInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={editingUser.email} onChange={handleEditInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select name="role" value={editingUser.role} onChange={handleEditInputChange} required>
                                    <option value="president">Presidente</option>
                                    <option value="vice_president">Vicepresidente</option>
                                    <option value="leader">Líder</option>
                                    <option value="member">Miembro</option>
                                </Form.Select>
                            </Form.Group>

                            {editingUser.role === 'member' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Líder Asignado</Form.Label>
                                    <Form.Select name="assignedLeader" value={editingUser.assignedLeader || ""} onChange={handleEditInputChange}>
                                        <option value="">Sin Asignar</option>
                                        {leaders.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>ID Estudiante</Form.Label>
                                <Form.Control type="text" name="student_id" value={editingUser.student_id} onChange={handleEditInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text" name="phone" value={editingUser.phone} onChange={handleEditInputChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="switch"
                                    id="edit-custom-switch"
                                    label={editingUser.isActive ? "Usuario Activo" : "Usuario Inactivo"}
                                    name="isActive"
                                    checked={editingUser.isActive !== false} // Default to true if undefined
                                    onChange={handleEditInputChange}
                                    disabled={currentUser?.role !== 'strategic_coordinator' && ['president', 'vice_president', 'strategic_coordinator'].includes(editingUser.role)}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                                <Button variant="primary" type="submit">Guardar Cambios</Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.name}</strong>?
                    Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            {includeFooter && <Footer />}
        </>
    );
};

export default UserManagement;
