const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

async function generateAIReport(reportData, config) {
    if (!config.geminiApiKey) {
        throw new Error("Gemini API Key is missing in iso-config.json");
    }

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);

    // Explicitly use the 001 version which is more stable in v1beta
    let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    // Prepare a summarized context to avoid token limits (though 1.5 Flash has 1M context, best to be concise)
    const context = {
        filesAnalyzed: reportData.metrics.files.length,
        totalLOC: reportData.metrics.totalLOC,
        avgMaintainability: reportData.metrics.avgMaintainability,
        complexity: reportData.metrics.totalComplexity / reportData.metrics.files.length,
        hotspots: reportData.advanced.hotspots.map(h => ({ path: h.path, complexity: h.complexity, mi: h.mi })),
        security: {
            secrets: reportData.advanced.secretCount,
            vulnerabilities: reportData.advanced.securityAudit.vulnerabilities
        },
        process: {
            git: reportData.gitStats.isRepo,
            todos: reportData.advanced.todoCount
        },
        deepAnalysis: {
            deadCode: reportData.advanced.deepAnalysis?.deadCode.length || 0,
            layeringViolations: reportData.advanced.deepAnalysis?.layeringViolations.length || 0
        }
    };

    const prompt = `
    Act as an Senior ISO 25010 Quality Consultant.
    Analyze the following software metrics for a project:
    ${JSON.stringify(context, null, 2)}

    Please provide a report in Markdown format with the following sections:
    
    ### 🧠 Executive Summary
    A brief assessment of the project's health (1 paragraph).

    ### 🚨 Top 3 Critical Risks
    Identify the 3 most urgent issues based on the metrics (e.g., low maintainability in hotspots, security leaks, architecture violations).

    ### 🛡️ ISO Compliance Status
    - **Maintainability**: [Assess Status]
    - **Security**: [Assess Status]
    - **Reliability**: [Assess Status]

    ### 💡 Actionable Recommendations
    Provide 3 concrete, technical steps the developer should take immediately. Be specific (e.g., "Refactor file X", "Remove dead code", "Fix architecture violation").
    
    Keep the tone professional yet encouraging.
    `;

    const candidateModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash-001"
    ];

    let lastError = null;

    for (const modelName of candidateModels) {
        try {
            console.log(chalk.blue(`Attempting Generative AI Model: ${modelName}...`));
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.warn(chalk.yellow(`Model '${modelName}' failed: ${error.message.split('[')[0]}... (Trying next)`));
            lastError = error;
            // Continue to next model
        }
    }

    // If all failed
    console.error("All AI models failed.");
    throw new Error(`Failed to generate report with any model. Last error: ${lastError?.message}`);
}

module.exports = { generateAIReport };
