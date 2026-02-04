const express = require('express');
const path = require('path');
const { analyzeProject } = require('./index');

const app = express();
const PORT = 3456; // Changed port to avoid conflicts
app.disable('etag');

// Serve static files from 'public' directory
const publicPath = path.join(__dirname, 'public');
console.log('Serving static files from:', publicPath);

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Explicit Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(express.static(publicPath));

app.get('/api/report', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    try {
        const report = await analyzeProject();
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Report Endpoint
const { generateAIReport } = require('./ai-analyzer');
const fs = require('fs');

app.get('/api/ai-report', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
        // Load config again to ensure we have the key
        const configPath = path.join(__dirname, 'iso-config.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        // We need the latest report data. Ideally, we should cache it or pass it.
        // For simplicity, we'll re-run analysis or read from disk if saved? 
        // Re-running is safer for freshness.
        const report = await analyzeProject();

        if (!config.geminiApiKey) {
            return res.status(400).json({ error: "API Key Not Configured. Add 'geminiApiKey' to iso-config.json to enable this feature." });
        }

        const aiResponse = await generateAIReport(report, config);
        res.json({ markdown: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`ISO Analyzer Server running at http://localhost:${PORT}`);
    console.log(`You MUST manually open this URL in your browser.`);
    console.log(`==================================================\n`);
});

// FORCE KEEP ALIVE
setInterval(() => {
    // This empty interval keeps the event loop active if express fails to do so
}, 1000 * 60 * 60);

server.on('error', (e) => {
    console.error('Server Error:', e);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
