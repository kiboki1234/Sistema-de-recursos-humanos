// Footer.js
import React from "react";
//import "./Footer.css"; // Archivo de estilos opcional para el pie de página
import logoIcon from "../img/logonav.png"; // Importar la imagen del logo

const Footer = () => {
    return (
        <footer className=" footer text-white py-4">
            <div className="container text-center">
                <img className="logo-footer" src={logoIcon} alt="logo" style={{ width: '100px' }} />
                <p className="mt-3">
                    &copy; {new Date().getFullYear()} CPED - Todos los derechos reservados.
                </p>
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <a href="#" className="text-white text-decoration-none mx-2">Política de privacidad</a>
                    </li>
                    <li className="list-inline-item">
                        <a href="#" className="text-white text-decoration-none mx-2">Términos de uso</a>
                    </li>
                    <li className="list-inline-item">
                        <a href="#" className="text-white text-decoration-none mx-2">Contacto</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
