import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../../api";
import UserManagement from "../userManagment/UserManagment";
import CalendarComponent from "../pagesLeaderTH/CalendarComponent";
import UserAttendanceChart from "../pagesLeaderTH/AttandanceChart";
import { FaUsers, FaTasks, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import "../css/style.css";
import Footer from "../common/Footer";
import CurrentDirective from "../common/CurrentDirective";
import MandateHistory from '../common/MandateHistory';

const StrategicCoordinatorView = () => {
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalTasks: 0,
        totalPractices: 0,
        usersByRole: {
            president: 0,
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
                if (user.role !== "strategic_coordinator") {
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
                <h1 className="mb-4">Panel de Coordinador Estratégico</h1>

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
                                <h3 className="mt-3">
                                    {Object.values(statistics.usersByRole).reduce((a, b) => a + b, 0)}
                                </h3>
                                <p className="text-muted">Miembros del Club</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Current Directive */}
                <CurrentDirective />

                {/* Historial de Mandatos */}
                <MandateHistory />

                {/* Users by Role */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">Distribución por Rol</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3} className="text-center">
                                        <h4>{statistics.usersByRole.president || 0}</h4>
                                        <p className="text-muted">Presidentes</p>
                                    </Col>
                                    <Col md={3} className="text-center">
                                        <h4>{statistics.usersByRole.vice_president || 0}</h4>
                                        <p className="text-muted">Vicepresidentes</p>
                                    </Col>
                                    <Col md={3} className="text-center">
                                        <h4>{statistics.usersByRole.leader || 0}</h4>
                                        <p className="text-muted">Líderes</p>
                                    </Col>
                                    <Col md={3} className="text-center">
                                        <h4>{statistics.usersByRole.member || 0}</h4>
                                        <p className="text-muted">Miembros</p>
                                    </Col>
                                </Row>
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

                {/* Attendance Chart */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-info text-white">
                                <h5 className="mb-0">Asistencia General</h5>
                            </Card.Header>
                            <Card.Body>
                                <UserAttendanceChart />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* User Management */}
                <Row className="mb-4">
                    <Col md={12}>
                        <UserManagement includeFooter={false} />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default StrategicCoordinatorView;
