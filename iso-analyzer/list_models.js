const https = require('https');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'iso-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const apiKey = config.geminiApiKey;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("AVAILABLE MODELS:");
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log("No models found or error:", json);
            }
        } catch (e) {
            console.error("Parse error:", e);
            console.log("Raw:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
