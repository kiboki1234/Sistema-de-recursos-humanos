import React, { useState, useContext, useEffect } from "react";
import CustomModal from "./ModalLogin";
import "../css/stylesLogin.css";
import API_BASE_URL from "../../../api";
import { AuthContext } from "../../../components/AuthContext";
import Footer from "../../common/Footer";

const Login = () => {
    const [modalInfo, setModalInfo] = useState({ title: "Modal title", text: "..." });
    const [showModal, setShowModal] = useState(false);
    const { login } = useContext(AuthContext);

    // Estado para controlar si se puede instalar la PWA
    const [isReadyForInstall, setIsReadyForInstall] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            console.log("👍", "beforeinstallprompt event triggered");
            window.deferredPrompt = event; // Guardar el evento para activarlo después
            setIsReadyForInstall(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    async function downloadApp() {
        console.log("👍", "Install button clicked");
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            console.log("Oops, no install prompt found");
            return;
        }
        promptEvent.prompt();
        const result = await promptEvent.userChoice;
        console.log("User choice:", result);

        if (result.outcome === "accepted") {
            console.log("User accepted the PWA installation");
        } else {
            console.log("User dismissed the PWA installation");
        }

        window.deferredPrompt = null;
        setIsReadyForInstall(false);
    }

    const handleModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: e.target.username.value,
                    password: e.target.passwordLogin.value,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setModalInfo({ title: "¡Éxito!", text: "Inicio de sesión exitoso." });
                login(data.token, data.user);
                window.location.href = "/";
            } else {
                setModalInfo({ title: "Error", text: data.message || "Algo salió mal." });
            }
            handleModal();
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setModalInfo({ title: "Error", text: "No se pudo conectar al servidor." });
            handleModal();
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="container pt-4 flex-grow-1">
                <form onSubmit={handleSubmit} className="login-container form-control">
                    <h1 className="h3 mb-3 fw-normal">Accede a tu cuenta del club CPED</h1>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            placeholder="Usuario"
                            required
                        />
                        <label htmlFor="username">Usuario</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="passwordLogin"
                            name="passwordLogin"
                            placeholder="Contraseña"
                            required
                        />
                        <label htmlFor="passwordLogin">Contraseña</label>
                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit">Iniciar Sesión</button>
                </form>

                <div className="text-center mt-4">
                    <p>Descarga nuestra aplicación PWA para una mejor experiencia:</p>
                    <button className="btn btn-success" onClick={downloadApp}>
                        Descargar PWA
                    </button>
                </div>

                {isReadyForInstall && (
                    <div className="text-center mt-3">
                        <button className="btn btn-warning" onClick={downloadApp}>
                            Instalar Aplicación
                        </button>
                    </div>
                )}
            </div>

            <CustomModal show={showModal} handleClose={handleCloseModal} modalInfo={modalInfo} />
            <Footer />
        </div>
    );
};

export default Login;
