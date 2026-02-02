import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api';
import Footer from '../common/Footer';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/contact/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error al obtener los mensajes:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container pt-4 mt-4 flex-grow-1">
        <h1 className="text-center">Mensajes de Contacto</h1>
        <ul className="list-group">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <li key={index} className="list-group-item">
                <h5>{message.name}</h5>
                <p><strong>Teléfono:</strong> {message.phone}</p>
                <p><strong>Mensaje:</strong> {message.message}</p>
                <p><small><strong>Enviado el:</strong> {new Date(message.createdAt).toLocaleString()}</small></p>
              </li>
            ))
          ) : (
            <li className="list-group-item">
              <p className="text-muted mb-0">No hay mensajes de contacto.</p>
            </li>
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default UserMessages;