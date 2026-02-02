import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import API_BASE_URL from '../../api';
import { AuthContext } from '../../components/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserAttendanceChart = () => {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Asistencias',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/attendances/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error('La respuesta de la API no es un array');
        }

        // Filtrar asistencias donde attended es true Y el usuario existe (no es null)
        const filteredData = data.filter(item => item.attended && item.user);

        // Contar asistencias por usuario
        const attendanceCount = {};
        filteredData.forEach(item => {
          const userId = item.user._id;
          if (!attendanceCount[userId]) {
            attendanceCount[userId] = { count: 0, name: item.user.name };
          }
          attendanceCount[userId].count += 1;
        });

        // Preparar datos para la gráfica
        const labels = Object.values(attendanceCount).map(item => item.name);
        const counts = Object.values(attendanceCount).map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Asistencias',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error al obtener los datos de asistencia:', error);
      }
    };

    fetchAttendanceData();
  }, [user]);

  return (
    <div>
      <h2>Gráfica de Asistencias</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default UserAttendanceChart;