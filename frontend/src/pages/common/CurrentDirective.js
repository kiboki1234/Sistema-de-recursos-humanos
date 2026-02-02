import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Badge, Spinner, Image } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import API_BASE_URL from '../../api';

const CurrentDirective = () => {
    const [directive, setDirective] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDirective = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(`${API_BASE_URL}/api/users/directive`, { headers });
                setDirective(response.data);
            } catch (error) {
                console.error("Error fetching directive:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDirective();
    }, []);

    if (loading) {
        return <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>;
    }

    if (!directive) {
        return <div className="text-center text-muted">No se pudo cargar la información de la directiva.</div>;
    }

    const { strategic_coordinator, president, vice_president, leaders } = directive;

    const DirectiveCard = ({ title, user, bg = "light", border = "0" }) => (
        <Card className={`h-100 shadow-sm border-${border} bg-${bg} text-${bg === 'light' ? 'dark' : 'white'}`}>
            <Card.Body className="text-center">
                <h6 className="text-uppercase mb-2 opacity-75" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>{title}</h6>
                {user ? (
                    <>
                        <div className="mb-3 d-flex justify-content-center">
                            {user.profilePicture ? (
                                <Image
                                    src={user.profilePicture}
                                    roundedCircle
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)' }}
                                />
                            ) : (
                                <FaUserCircle size={80} className={`text-${bg === 'light' ? 'secondary' : 'white'} opacity-50`} />
                            )}
                        </div>
                        <h4 className="fw-bold mb-1">{user.name}</h4>
                        <div className="small mb-1 opacity-75">{user.email}</div>
                        <div className="small opacity-75">{user.phone}</div>
                        <Badge bg={bg === 'light' ? 'success' : 'light'} text={bg === 'light' ? 'light' : 'dark'} className="mt-2">Activo</Badge>
                    </>
                ) : (
                    <div className="text-muted fst-italic py-3">Vacante</div>
                )}
            </Card.Body>
        </Card>
    );

    return (
        <div className="mb-5">
            <h3 className="mb-4 border-bottom pb-2">Directiva Actual</h3>

            {/* High Command */}
            <Row className="g-4 mb-4 justify-content-center">
                <Col md={4} lg={4}>
                    <DirectiveCard title="Coordinador Estratégico" user={strategic_coordinator} bg="dark" />
                </Col>
                <Col md={4} lg={4}>
                    <DirectiveCard title="Presidente" user={president} bg="primary" />
                </Col>
                <Col md={4} lg={4}>
                    <DirectiveCard title="Vicepresidente" user={vice_president} bg="info" />
                </Col>
            </Row>

            {/* Leaders */}
            <h5 className="mb-3 text-secondary">Líderes de Equipo</h5>
            {leaders && leaders.length > 0 ? (
                <Row className="g-3">
                    {leaders.map(leader => (
                        <Col key={leader._id} sm={6} md={4} lg={3}>
                            <Card className="h-100 border-start border-4 border-success shadow-sm">
                                <Card.Body className="py-2 d-flex align-items-center gap-3">
                                    {leader.profilePicture ? (
                                        <Image
                                            src={leader.profilePicture}
                                            roundedCircle
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <FaUserCircle size={40} className="text-secondary" />
                                    )}
                                    <div>
                                        <div className="fw-bold">{leader.name}</div>
                                        <div className="text-muted small" style={{ fontSize: '0.85rem' }}>{leader.email}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p className="text-muted">No hay líderes asignados actualmente.</p>
            )}
        </div>
    );
};

export default CurrentDirective;
