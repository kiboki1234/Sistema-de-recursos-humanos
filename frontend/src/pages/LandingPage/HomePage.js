import React from "react";
import Footer from "./Footer";
import BottonWhatsApp from "./ButtonWhatsApp";
import "./css/style.css";
import "./css/styleWhatsappBtn.css";

const HomePage = () => {
    return (
        <>

            {/* Carrusel de fotos */}
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733635840/IMG_4891_s9rdvn.jpg" className="d-block w-100" alt="Imagen 1" />
                        <div className="carousel-caption d-none d-md-block">
                            <h1>Bienvenido al Club de Política Exterior y Diplomación</h1>
                            <p>Simulamos modelos de debate como la ONU y el Parlamento Británico. ¡Únete a nosotros para desarrollar tus habilidades de oratoria y diplomacia!</p>
                            <a href="/AboutUs" className="btn btn-primary btn-lg">Saber más</a>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733635566/IMG_20241121_135408_gz3yev.jpg" className="d-block w-100" alt="Imagen 2" />
                        <div className="carousel-caption d-none d-md-block">
                            <h1>Ven y se parte de esta única experiencia</h1>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733636241/WhatsApp_Image_2024-12-06_at_16.02.57_c45df41e_orykcj.jpg" className="d-block w-100" alt="Imagen 3" />
                        <div className="carousel-caption d-none d-md-block">
                            <h1>Aprende y desarrolla nuevas habilidades</h1>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Sección de Modelos de Debate */}
            <section id="modelos" className="container my-5">
                <h2 className="section-title">Modelos de Debate</h2>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733636620/WhatsApp_Image_2024-12-06_at_16.03.04_95e83afd_odjtsr.jpg" className="card-img-top" alt="Modelo ONU" />
                            <div className="card-body">
                                <h5 className="card-title">Modelo ONU</h5>
                                <p>Simula las reuniones de la ONU, permitiendo a los participantes representar países y debatir sobre temas globales.</p>
                                <a href="modelosDebate.html" className="btn btn-primary btn-primary-style">Más Información</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733636518/parlamento_yaipq5.jpg" className="card-img-top" alt="Parlamento Británico" />
                            <div className="card-body">
                                <h5 className="card-title">Parlamento Británico</h5>
                                <p>Un formato dinámico de debate competitivo donde equipos argumentan a favor o en contra de una moción.</p>
                                <a href="modelosDebate.html" className="btn btn-primary">Más Información</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Eventos */}
            <section id="eventos" className="container my-5">
                <h2 className="section-title">Próximos Eventos</h2>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733638013/WhatsApp_Image_2024-12-06_at_16.03.04_3caad7df_ftintb.jpg" className="card-img-top" alt="Evento 1" />
                            <div className="card-body">
                                <h5 className="card-title">SICMUN V</h5>
                                <p>Fecha: 15 de diciembre | Lugar: Auditorio Central</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733637672/SICMUN_wuxwut.png" className="card-img-top" alt="Evento 2" />
                            <div className="card-body">
                                <h5 className="card-title">BUSSINESMUN V</h5>
                                <p>Fecha: 20 de diciembre | Lugar: Salón de Conferencias</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Botón de WhatsApp */}
            <BottonWhatsApp />

            {/* Pie de página */}
            <Footer />
        </>
    );
};

export default HomePage;
