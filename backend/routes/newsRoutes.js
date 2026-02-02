const express = require('express');
const { getNews } = require('../controllers/newsController');

const router = express.Router();

router.get('/', getNews);  // Ruta: /api/news?q=bitcoin

module.exports = router;
