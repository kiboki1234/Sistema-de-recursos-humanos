import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../api";
import BottonWhatsApp from "../ButtonWhatsApp";
import "../css/styleContacts.css";
import Footer from "../Footer";

const Contacts = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/contact/messages`, formData);
            setStatus("success");
            setFormData({ name: "", phone: "", message: "" });
        } catch (error) {
            setStatus("error");
            console.error("Error al enviar el mensaje:", error);
        }
    };

    return (
        <>
            <div className="container pt-4">
                <div className="contact-container">
                    <h1 className="text-center header-title">Contáctanos</h1>
                    <p className="text-center">¿Tienes preguntas? ¡Estamos aquí para ayudarte!</p>
                    <div className="contact-info mb-4">
                        <h5>Información de Contacto</h5>
                        <p><strong>Correo:</strong> cped@espe.edu.ec</p>
                        <p><strong>Teléfono:</strong> +593 90 695 6237</p>
                        <p><strong>Dirección:</strong> Av. Gral. Rumiñahui S/N, Sangolquí 171103</p>
                    </div>
                    {status === 'success' && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>En buena hora!</strong> Tu mensaje se ha enviado con éxito.
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>¡Error!</strong> No se ha podido enviar tu mensaje.
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input type="text" className="form-control" maxLength="100" id="name" name="name" placeholder="Ingresa tu nombre completo" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Número de teléfono</label>
                            <input type="text" className="form-control" id="phone" name="phone" maxLength="15" placeholder="Ejm: +593992622595" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Mensaje</label>
                            <textarea className="form-control" id="message" name="message" rows="5" placeholder="Escribe tu mensaje aquí" value={formData.message} onChange={handleChange} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Enviar Mensaje</button>
                    </form>
                </div>
            </div>
            <BottonWhatsApp />
            <Footer />
        </>
    );
};

export default Contacts;
