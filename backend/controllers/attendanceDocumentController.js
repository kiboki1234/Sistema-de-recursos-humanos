const Attendance = require('../models/Attendance');
const Practice = require('../models/Practice');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Generar informe de asistencia en PDF
exports.generateAttendancePDF = async (req, res) => {
    try {
        const { practiceId } = req.params;

        // Obtener la práctica y todos los usuarios
        const practice = await Practice.findById(practiceId);
        if (!practice) {
            return res.status(404).json({ message: "Práctica no encontrada." });
        }

        const allUsers = await User.find();
        const attendances = await Attendance.find({ practice: practiceId });

        // Crear un mapa de asistencias registradas
        const attendanceMap = {};
        attendances.forEach(attendance => {
            attendanceMap[attendance.user.toString()] = attendance.attended ? 'Sí' : 'No';
        });

        const doc = new PDFDocument();
        res.setHeader('Content-Disposition', `attachment; filename="asistencia_${practice.title}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);
        doc.fontSize(18).text(`Lista de Asistencia - ${practice.title}`, { align: 'center' });
        doc.fontSize(12).text(`Fecha: ${practice.date}`);
        doc.text(`Hora: ${practice.startTime} - ${practice.endTime}`);
        doc.moveDown();

        // Generar lista con usuarios que asistieron y los que no
        allUsers.forEach((user, index) => {
            const attended = attendanceMap[user._id.toString()] || 'No';
            doc.text(`${index + 1}. ${user.name} - ${user.email} - ${attended}`);
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({ message: 'Error al generar PDF', error: error.message });
    }
};

// Generar informe de asistencia en Excel
exports.generateAttendanceExcel = async (req, res) => {
    try {
        const { practiceId } = req.params;

        const practice = await Practice.findById(practiceId);
        if (!practice) {
            return res.status(404).json({ message: "Práctica no encontrada." });
        }

        const allUsers = await User.find();
        const attendances = await Attendance.find({ practice: practiceId });

        // Crear un mapa de asistencias registradas
        const attendanceMap = {};
        attendances.forEach(attendance => {
            attendanceMap[attendance.user.toString()] = attendance.attended ? 'Sí' : 'No';
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Asistencia');

        worksheet.columns = [
            { header: 'N°', key: 'index', width: 10 },
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Asistencia', key: 'attended', width: 15 }
        ];

        allUsers.forEach((user, index) => {
            worksheet.addRow({
                index: index + 1,
                name: user.name,
                email: user.email,
                attended: attendanceMap[user._id.toString()] || 'No'
            });
        });

        res.setHeader('Content-Disposition', `attachment; filename=asistencia_${practice.title}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar Excel:', error);
        res.status(500).json({ message: 'Error al generar Excel', error: error.message });
    }
};
