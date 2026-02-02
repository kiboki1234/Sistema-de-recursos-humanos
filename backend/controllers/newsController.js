const axios = require('axios');

const getNews = async (req, res) => {
    const { query } = req.query;

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: query || 'politics OR foreign affairs OR diplomacy OR geopolitics',
                language: 'en',  // Solo en inglés
                sortBy: 'publishedAt',
                pageSize: 10,  // Número de artículos por página
                apiKey: process.env.NEWS_API_KEY
            }
        });

        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener noticias", error: error.message });
    }
};

module.exports = { getNews };
