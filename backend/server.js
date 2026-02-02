const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const vicePresidentRoutes = require('./routes/vicePresidentRoutes');
const presidentRoutes = require('./routes/presidentRoutes');
const memberRoutes = require('./routes/memberRoutes');
const strategicCoordinatorRoutes = require('./routes/strategicCoordinatorRoutes');
const leaderRoutes = require('./routes/leaderRoutes');
const taskRoutes = require('./routes/taskRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const news = require('./routes/newsRoutes');
const API_BASE_URL = require("./api");
const contactRoutes = require('./routes/contactRoutes');
const { protect } = require('./middlewares/authMiddleware');
const attendanceRoutes = require('./routes/attendanceRoutes');
const documentsRoutes = require('./routes/attendanceDocumentRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: API_BASE_URL, credentials: true }));


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vicePresidents', vicePresidentRoutes);
app.use('/api/presidents', presidentRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/strategicCoordinators', strategicCoordinatorRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/practices', practiceRoutes);
app.use('/api/news', news);
// Rutas de contacto
app.use('/api/contact', contactRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/documents', documentsRoutes);
const teamRoutes = require('./routes/teamRoutes');
app.use('/api/teams', teamRoutes);

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
