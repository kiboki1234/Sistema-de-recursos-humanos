import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Accordion, Badge } from 'react-bootstrap';
import { FaUsers, FaTasks, FaCalendarAlt, FaLayerGroup } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../api';
import CalendarComponent from '../pagesLeaderTH/CalendarComponent';
import Footer from '../common/Footer';

const LeaderView = () => {
    const [statistics, setStatistics] = useState({
        totalMembers: 0,
        totalTeams: 0,
        assignedTasks: 0,
        upcomingPractices: 0,
    });

    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const userId = JSON.parse(localStorage.getItem('user'))?.id;

            const [teamsRes, tasksRes, practicesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/teams/my-teams`, { headers }),
                axios.get(`${API_BASE_URL}/api/tasks/assigned-by/${userId}`, { headers }),
                axios.get(`${API_BASE_URL}/api/practices/all`),
            ]);

            const myTeams = teamsRes.data || [];
            setTeams(myTeams);

            // Calculate total unique members across all teams
            const uniqueMembers = new Set();
            myTeams.forEach(team => {
                team.members.forEach(member => uniqueMembers.add(member._id));
            });

            // Get tasks created by this leader
            setTasks(tasksRes.data || []);

            // Count upcoming practices
            const now = new Date();
            const upcoming = practicesRes.data.filter(p => new Date(p.date) > now);

            setStatistics({
                totalMembers: uniqueMembers.size,
                totalTeams: myTeams.length,
                assignedTasks: tasksRes.data?.length || 0,
                upcomingPractices: upcoming.length,
            });
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Container className="mt-5 pt-5 flex-grow-1">
                <h1 className="mb-4">Panel de Líder</h1>

                {/* Statistics Cards */}
                <Row className="mb-4 g-3">
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100 border-primary">
                            <Card.Body>
                                <FaLayerGroup className="text-primary" size={30} />
                                <h3 className="mt-2">{statistics.totalTeams}</h3>
                                <p className="text-muted small">Equipos Activos</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaUsers className="text-info" size={30} />
                                <h3 className="mt-2">{statistics.totalMembers}</h3>
                                <p className="text-muted small">Miembros Totales</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaTasks className="text-success" size={30} />
                                <h3 className="mt-2">{statistics.assignedTasks}</h3>
                                <p className="text-muted small">Tareas Asignadas</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaCalendarAlt className="text-warning" size={30} />
                                <h3 className="mt-2">{statistics.upcomingPractices}</h3>
                                <p className="text-muted small">Próximas Prácticas</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Teams and Members */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0">Mis Equipos y Miembros</h5>
                            </Card.Header>
                            <Card.Body>
                                {teams.length > 0 ? (
                                    <Accordion defaultActiveKey="0">
                                        {teams.map((team, index) => (
                                            <Accordion.Item eventKey={index.toString()} key={team._id}>
                                                <Accordion.Header>
                                                    <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                                                        <strong>{team.name}</strong>
                                                        <Badge bg="secondary" pill>
                                                            {team.members.length} Miembros
                                                        </Badge>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {team.description && <p className="text-muted small mb-3">{team.description}</p>}
                                                    {team.members.length > 0 ? (
                                                        <Table size="sm" hover borderless>
                                                            <thead className="text-muted">
                                                                <tr>
                                                                    <th>Nombre</th>
                                                                    <th>Email</th>
                                                                    <th>Teléfono</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {team.members.map(member => (
                                                                    <tr key={member._id}>
                                                                        <td>{member.name}</td>
                                                                        <td>{member.email}</td>
                                                                        <td>{member.phone}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    ) : (
                                                        <p className="text-muted small mb-0">Este equipo aún no tiene miembros.</p>
                                                    )}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="text-center py-4 text-muted">
                                        <p>No tienes equipos creados.</p>
                                        <a href="/team-management" className="btn btn-primary btn-sm">Crear mi primer equipo</a>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Calendar */}
                <Row>
                    <Col md={12}>
                        <CalendarComponent />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default LeaderView;
