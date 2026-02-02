import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import API_BASE_URL from "../../api";
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [practices, setPractices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener prácticas desde el backend
    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/practices/all`);
                setPractices(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar prácticas:", err);
                setError("No se pudieron cargar las prácticas.");
                setLoading(false);
            }
        };
        fetchPractices();
    }, []);

    // Convertir prácticas en eventos para el calendario
    const events = practices.map((practice) => {
        // practice.date ahora es un Date object, necesitamos convertirlo a string ISO
        const dateStr = new Date(practice.date).toISOString().split('T')[0]; // "YYYY-MM-DD"

        return {
            title: practice.title,
            start: new Date(`${dateStr}T${practice.startTime}`),
            end: new Date(`${dateStr}T${practice.endTime}`),
        };
    });

    if (loading) {
        return <div className="text-center">Cargando calendario...</div>;
    }

    if (error) {
        return <div className="text-danger text-center">{error}</div>;
    }

    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white">Calendario de Prácticas</div>
            <div className="card-body">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    defaultView="week"
                    views={["week", "month", "day"]}
                />
            </div>
        </div>
    );
};

export default CalendarComponent;
