import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../../api";
import CalendarComponent from "../pagesLeaderTH/CalendarComponent";
import CreatePractice from "../pagesLeaderTH/CreatePractice";
import PracticesList from "../pagesLeaderTH/PracticesList";
import UserAttendanceChart from "../pagesLeaderTH/AttandanceChart";
import { FaUsers, FaTasks, FaCalendarCheck } from "react-icons/fa";
import "../css/style.css";
import Footer from "../common/Footer";
import CurrentDirective from "../common/CurrentDirective";

const PresidentView = () => {
    const [statistics, setStatistics] = useState({
        totalVicePresidents: 0,
        totalLeaders: 0,
        totalTasks: 0,
        totalPractices: 0,
    });

    const [vicePresidents, setVicePresidents] = useState([]);
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        fetchStatistics();
        fetchTeamMembers();
    }, []);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [tasksRes, practicesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/tasks/all`, { headers }),
                axios.get(`${API_BASE_URL}/api/practices/all`, { headers }),
            ]);

            setStatistics(prev => ({
                ...prev,
                totalTasks: tasksRes.data.length,
                totalPractices: practicesRes.data.length,
            }));
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(`${API_BASE_URL}/api/users/all`, { headers });
            const users = response.data;

            const vps = users.filter(user => user.role === 'vice_president');
            const ldrs = users.filter(user => user.role === 'leader');

            setVicePresidents(vps);
            setLeaders(ldrs);

            setStatistics(prev => ({
                ...prev,
                totalVicePresidents: vps.length,
                totalLeaders: ldrs.length,
            }));
        } catch (error) {
            console.error("Error al obtener miembros del equipo:", error);
        }
    };

    const [vpSearch, setVpSearch] = useState("");
    const [leaderSearch, setLeaderSearch] = useState("");

    const filteredVPs = vicePresidents.filter(vp =>
        vp.name.toLowerCase().includes(vpSearch.toLowerCase()) ||
        vp.email.toLowerCase().includes(vpSearch.toLowerCase())
    );

    const filteredLeaders = leaders.filter(l =>
        l.name.toLowerCase().includes(leaderSearch.toLowerCase()) ||
        l.email.toLowerCase().includes(leaderSearch.toLowerCase())
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            <Container className="mt-5 pt-5 flex-grow-1">
                <h1 className="mb-4">Panel de Presidente</h1>


                {/* Statistics Cards */}
                <Row className="mb-4 g-3">
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100 bg-primary text-white">
                            <Card.Body>
                                <FaUsers size={40} />
                                <h3 className="mt-3">{statistics.totalVicePresidents}</h3>
                                <p>Vicepresidentes</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100 bg-success text-white">
                            <Card.Body>
                                <FaUsers size={40} />
                                <h3 className="mt-3">{statistics.totalLeaders}</h3>
                                <p>Líderes</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100 bg-warning text-white">
                            <Card.Body>
                                <FaTasks size={40} />
                                <h3 className="mt-3">{statistics.totalTasks}</h3>
                                <p>Total Tareas</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100 bg-info text-white">
                            <Card.Body>
                                <FaCalendarCheck size={40} />
                                <h3 className="mt-3">{statistics.totalPractices}</h3>
                                <p>Total Prácticas</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Current Directive */}
                <CurrentDirective />

                {/* Team Members */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">Vicepresidentes Asignados</h5>
                            </Card.Header>
                            <Card.Body>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Buscar VP..."
                                    value={vpSearch}
                                    onChange={(e) => setVpSearch(e.target.value)}
                                />
                                {filteredVPs.length > 0 ? (
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredVPs.map(vp => (
                                                <tr key={vp._id}>
                                                    <td>{vp.name}</td>
                                                    <td>{vp.email}</td>
                                                    <td>{vp.phone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-muted text-center">No encontrado</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-success text-white">
                                <h5 className="mb-0">Líderes Asignados</h5>
                            </Card.Header>
                            <Card.Body>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Buscar Líder..."
                                    value={leaderSearch}
                                    onChange={(e) => setLeaderSearch(e.target.value)}
                                />
                                {filteredLeaders.length > 0 ? (
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLeaders.map(leader => (
                                                <tr key={leader._id}>
                                                    <td>{leader.name}</td>
                                                    <td>{leader.email}</td>
                                                    <td>{leader.phone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-muted text-center">No encontrado</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Calendar */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-secondary text-white">
                                <h5 className="mb-0">Calendario de Prácticas</h5>
                            </Card.Header>
                            <Card.Body>
                                <CalendarComponent />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Practice Management */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-info text-white">
                                <h5 className="mb-0">Crear Nueva Práctica</h5>
                            </Card.Header>
                            <Card.Body>
                                <CreatePractice />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-warning text-white">
                                <h5 className="mb-0">Prácticas Registradas</h5>
                            </Card.Header>
                            <Card.Body>
                                <PracticesList />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Attendance Chart */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-dark text-white">
                                <h5 className="mb-0">Asistencia del Equipo</h5>
                            </Card.Header>
                            <Card.Body>
                                <UserAttendanceChart />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default PresidentView;
