// Events.js
import React from "react";
import BottonWhatsApp from "../ButtonWhatsApp";
import Footer from "../Footer";
import "../css/styleEvents.css";
import "../css/styleWhatsappBtn.css";

const Events = () => {
    const events = [
        {
            title: "SICMUN",
            date: "20 de diciembre, 2024",
            location: "Auditorio Universidad",
            description: "Explora temas globales mientras desarrollas habilidades de oratoria y negociación.",
            image: "https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733637315/4_c5rwje.png",
        },
        {
            title: "BUSSINES MUN",
            date: "19 de enero, 2025",
            location: "Salón de Conferencias",
            description: "Participa en debates rápidos y argumenta con persuasión sobre temas asignados.",
            image: "https://res.cloudinary.com/dp8wdwo5h/image/upload/v1733637672/SICMUN_wuxwut.png",
        },
    ];

    return (
        <>
            
            <div className="container event-container pt-4">
                <h1 className="text-center header-title">Próximos Eventos</h1>
                <div className="row g-4">
                    {events.map((event, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="card">
                                <img src={event.image} className="card-img-top" alt={event.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-text">
                                        Fecha: {event.date}<br />
                                        Lugar: {event.location}<br />
                                        Descripción: {event.description}
                                    </p>
                                    <a href="#" className="btn btn-primary w-100">Más Información</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottonWhatsApp />
            <Footer />
            
        </>
    );
};

export default Events;
