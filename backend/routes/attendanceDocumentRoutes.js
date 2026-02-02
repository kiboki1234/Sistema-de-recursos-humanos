const express = require('express');
const {
    generateAttendancePDF,
    generateAttendanceExcel
} = require('../controllers/attendanceDocumentController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/report/pdf/:practiceId', protect, generateAttendancePDF);
router.get('/report/excel/:practiceId', protect, generateAttendanceExcel);

module.exports = router;
