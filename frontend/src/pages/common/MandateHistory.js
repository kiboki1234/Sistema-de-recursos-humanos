import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import API_BASE_URL from '../../api';

const MandateHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${API_BASE_URL}/api/users/mandates-history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching mandate history:", err);
                setError("No se pudo cargar el historial.");
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getRoleBadge = (role) => {
        switch (role) {
            case 'strategic_coordinator': return <Badge bg="dark">Coordinador Estratégico</Badge>;
            case 'president': return <Badge bg="primary">Presidente</Badge>;
            case 'vice_president': return <Badge bg="info">Vicepresidente</Badge>;
            default: return <Badge bg="secondary">{role}</Badge>;
        }
    };

    if (loading) return <div className="text-center py-3"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="warning">{error}</Alert>;
    if (history.length === 0) return null; // Don't show if empty

    return (
        <Card className="shadow-sm mb-4">
            <Card.Header className="bg-secondary text-white">
                <i className="bi bi-clock-history me-2"></i>Historial de Mandatos
            </Card.Header>
            <Card.Body>
                <Table responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Periodo / Fecha Fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>{user.period || new Date(user.createdAt).getFullYear()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default MandateHistory;
