import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

const NewsList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("politics OR foreign affairs OR diplomacy");

    useEffect(() => {
        fetchNews(searchTerm);
    }, []);

    const fetchNews = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/news?q=${query}`);
            setArticles(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener noticias:", error);
            setError("Error al obtener noticias");
            setLoading(false);
        }
    };
    

    const handleSearch = (e) => {
        e.preventDefault();
        fetchNews(searchTerm);
    };

    return (
        <div className="container mt-4 pt-4">
            <h1 className="mb-4  pt-4 text-center">Noticias de Política y Relaciones Exteriores</h1>
            <form onSubmit={handleSearch} className="mb-4 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar noticias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Buscar</button>
            </form>
            {loading && <p className="text-center">Cargando...</p>}
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="row">
                {articles.map((article, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={article.urlToImage || "https://via.placeholder.com/300"} className="card-img-top" alt={article.title} />
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">{article.description || "Sin descripción"}</p>
                                <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Leer más</a>
                            </div>
                            <div className="card-footer text-muted">
                                {new Date(article.publishedAt).toLocaleDateString()} - {article.source.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsList;
