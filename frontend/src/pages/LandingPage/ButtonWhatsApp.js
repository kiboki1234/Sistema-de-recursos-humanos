// BottonWhatsApp.js
import React from "react";
import socialIcon from "./assets/img/social.png"; // Importar la imagen de WhatsApp
//import "./BottonWhatsApp.css"; // Archivo de estilos opcional

const BottonWhatsApp = () => {
    return (
        <div className="message">
            <button className="message__button">
                <a href="https://wa.me/593986956237" target="_blank" rel="noopener noreferrer">
                    <img src={socialIcon} alt="Botón de WhatsApp" />
                </a>
            </button>
        </div>
    );
};

export default BottonWhatsApp;
