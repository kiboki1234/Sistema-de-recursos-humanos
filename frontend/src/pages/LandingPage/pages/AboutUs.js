// AboutUs.js
import React from "react";
import BottonWhatsApp from "../ButtonWhatsApp";
import Footer from "../Footer";
import "../css/styleAboutUs.css";
import "../css/styleWhatsappBtn.css";

const AboutUs = () => {
    return (
        <>
            <div className="container about-section pt-4">
                <h1 className="text-center header-title">Sobre Nosotros</h1>
                <p className="text-center">
                    El <strong>Club de Política Exterior y Diplomación (CPED)</strong> se dedica a promover el aprendizaje y la práctica de habilidades diplomáticas, de debate y negociación a través de simulaciones como Modelos de Naciones Unidas y el Parlamento Británico.
                </p>

                <div className="row g-4">
                    {/* Visión */}
                    <div className="col-md-6">
                        <div className="vision-mission">
                            <h5>Visión</h5>
                            <p>
                                Ser un referente en la formación de jóvenes líderes con habilidades de pensamiento crítico, diplomacia y capacidad para generar cambios en sus comunidades.
                            </p>
                        </div>
                    </div>
                    {/* Misión */}
                    <div className="col-md-6">
                        <div className="vision-mission">
                            <h5>Misión</h5>
                            <p>
                                Fomentar un espacio inclusivo y dinámico donde los participantes desarrollen habilidades comunicativas, analíticas y de liderazgo mediante modelos de debate.
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="section-title mt-5">Nuestro Equipo</h2>
                <div className="row g-4 text-center">
                   
                    <div className="col-md-3">
                        <div className="team-member">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733635563/IMG_20241121_133433_m8kkbh.jpg" alt="Presidenta" />
                            <h6>Presidenta</h6>
                            <p>Melissa Chavez</p>
                        </div>
                    </div>
                   
                    <div className="col-md-3">
                        <div className="team-member">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733635564/IMG_20241121_133448_g1klgh.jpg" alt="Líder de Talento Humano"/>
                            <h6>Coordinador Estrategico</h6>
                            <p>Israel Moreno</p>
                        </div>
                    </div>
                   
                    <div className="col-md-3">
                        <div className="team-member">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733723865/Screenshot_2024-12-09_005704_wa7hqv.png" alt="Coordinador Académico" />
                            <h6>Visepresidenta</h6>
                            <p>Haddy Andrango</p>
                        </div>
                    </div>
                   
                    <div className="col-md-3">
                        <div className="team-member">
                            <img src="https://res.cloudinary.com/dp8wdwo5h/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733723545/IMG_4821_fzew1q.jpg" alt="Presidenta" />
                            <h6>Coordinador Academico</h6>
                            <p>Josue Sueasnavas</p>
                        </div>
                    </div>
                </div>
            </div>

            <BottonWhatsApp />
            <Footer />
        </>
    );
};

export default AboutUs;
