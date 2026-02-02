import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Image, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../../api';
import { AuthContext } from '../../components/AuthContext';

const ProfileSettings = ({ show, onHide }) => {
    const { user, login } = useContext(AuthContext); // login is used to update user state
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/api/users/upload-photo`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update local user state
            const updatedUser = { ...user, profilePicture: response.data.profilePicture };
            login(token, updatedUser); // Re-save user to context and localStorage

            setMessage({ type: 'success', text: 'Foto de perfil actualizada correctamente.' });
            setTimeout(() => {
                onHide();
                setMessage(null);
            }, 2000);
        } catch (error) {
            console.error("Error uploading photo:", error);
            setMessage({ type: 'danger', text: 'Error al subir la imagen. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">

                {message && <Alert variant={message.type}>{message.text}</Alert>}

                <div className="mb-4 d-flex justify-content-center">
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #dee2e6' }}>
                        <Image
                            src={previewUrl || "https://via.placeholder.com/150?text=Sin+Foto"}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <Form.Group controlId="formFile" className="mb-3 text-start">
                    <Form.Label>Cambiar Foto de Perfil</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                    <Form.Text className="text-muted">
                        Formatos: JPG, PNG. Máx 5MB.
                    </Form.Text>
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleUpload} disabled={loading || !selectedFile}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Guardar Cambios'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProfileSettings;
