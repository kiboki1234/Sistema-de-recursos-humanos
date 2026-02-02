import React, { useState, useEffect } from "react";
import axios from "axios";
import PracticeDetails from "./PracticeDetails";
import API_BASE_URL from "../../api";

const PracticesList = () => {
    const [practices, setPractices] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Obtener prácticas desde el backend
    useEffect(() => {
        fetchPractices();
    }, []);

    const fetchPractices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/practices/all`);
            setPractices(response.data);
        } catch (error) {
            console.error("Error al obtener prácticas:", error);
        }
    };

    // Manejar la selección de práctica para mostrar detalles
    const handleSelectPractice = (practice) => {
        setSelectedPractice(practice);
        setShowModal(true);
    };

    // Cerrar modal de detalles
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPractice(null);
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredPractices = practices.filter(practice =>
        practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.date.includes(searchTerm)
    );

    return (
        <div>
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">Lista de Prácticas</div>
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar práctica por título o fecha..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredPractices.length > 0 ? (
                        <ul className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredPractices.map((practice) => (
                                <li
                                    key={practice._id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    {practice.title} - {new Date(practice.date).toLocaleDateString()}
                                    <button className="btn btn-info btn-sm" onClick={() => handleSelectPractice(practice)}>
                                        Ver Detalles
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted text-center">No se encontraron prácticas.</p>
                    )}
                </div>
            </div>
            {selectedPractice && (
                <PracticeDetails
                    practice={selectedPractice}
                    show={showModal}
                    handleClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default PracticesList;
