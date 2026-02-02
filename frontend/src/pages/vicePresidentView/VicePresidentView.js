import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaTasks, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../api';
import Footer from '../common/Footer';
import CurrentDirective from '../common/CurrentDirective';

const VicePresidentView = () => {
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalTasks: 0,
        totalPractices: 0,
        usersByRole: {
            vice_president: 0,
            leader: 0,
            member: 0,
        },
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [usersRes, tasksRes, practicesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/users/all`, { headers }),
                axios.get(`${API_BASE_URL}/api/tasks/all`, { headers }),
                axios.get(`${API_BASE_URL}/api/practices/all`, { headers }),
            ]);

            const users = usersRes.data;
            const usersByRole = users.reduce((acc, user) => {
                if (['vice_president', 'leader', 'member'].includes(user.role)) {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                }
                return acc;
            }, {});

            setStatistics({
                totalUsers: users.length,
                totalTasks: tasksRes.data.length,
                totalPractices: practicesRes.data.length,
                usersByRole,
            });
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Container className="mt-5 pt-5 flex-grow-1">
                <h1 className="mb-4">Panel de Vicepresidente</h1>

                {/* Statistics Cards */}
                <Row className="mb-4 g-3">
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaUsers className="text-primary" size={40} />
                                <h3 className="mt-3">{statistics.totalUsers}</h3>
                                <p className="text-muted">Total Usuarios</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaTasks className="text-success" size={40} />
                                <h3 className="mt-3">{statistics.totalTasks}</h3>
                                <p className="text-muted">Total Tareas</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaCalendarAlt className="text-warning" size={40} />
                                <h3 className="mt-3">{statistics.totalPractices}</h3>
                                <p className="text-muted">Total Prácticas</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm h-100">
                            <Card.Body>
                                <FaChartLine className="text-info" size={40} />
                                <h3 className="mt-3">{statistics.usersByRole.leader || 0}</h3>
                                <p className="text-muted">Líderes</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Current Directive */}
                <CurrentDirective />

                {/* Role Distribution */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">Distribución por Rol</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="text-center">
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <h4 className="text-info">{statistics.usersByRole.vice_president || 0}</h4>
                                            <p className="text-muted">Vicepresidentes</p>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <h4 className="text-success">{statistics.usersByRole.leader || 0}</h4>
                                            <p className="text-muted">Líderes</p>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <h4 className="text-warning">{statistics.usersByRole.member || 0}</h4>
                                            <p className="text-muted">Miembros</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Row>
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-secondary text-white">
                                <h5 className="mb-0">Acciones Rápidas</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="text-center">
                                    <Col md={4}>
                                        <a href="/practices" className="btn btn-outline-primary btn-lg w-100 mb-2">
                                            <FaCalendarAlt className="me-2" />
                                            Gestionar Prácticas
                                        </a>
                                    </Col>
                                    <Col md={4}>
                                        <a href="/tasks" className="btn btn-outline-success btn-lg w-100 mb-2">
                                            <FaTasks className="me-2" />
                                            Gestionar Tareas
                                        </a>
                                    </Col>
                                    <Col md={4}>
                                        <a href="/users" className="btn btn-outline-info btn-lg w-100 mb-2">
                                            <FaUsers className="me-2" />
                                            Gestionar Usuarios
                                        </a>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default VicePresidentView;
