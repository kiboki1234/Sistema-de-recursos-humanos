const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sloc = require('sloc');
const escomplex = require('typhonjs-escomplex');
const simpleGit = require('simple-git');
const chalk = require('chalk');

let projectRoot = path.resolve(__dirname, '..'); // Default root
const configPath = path.join(__dirname, 'iso-config.json');
// Initialize Git with default, can be overridden by config
let git = simpleGit(projectRoot);

let CONFIG = {
    include: ['backend/**/*.js', 'frontend/src/**/*.js'],
    exclude: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/*.test.js'],
    deepAnalysis: {
        entryPoints: ['index.js', 'server.js'],
        architecture: {
            frontend: ['frontend', 'src'],
            backend: ['backend', 'server']
        }
    }
};

// Load Config
if (fs.existsSync(configPath)) {
    try {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        // Merge config (shallow merge for arrays/objects for simplicity)
        if (userConfig.include) CONFIG.include = userConfig.include;
        if (userConfig.exclude) CONFIG.exclude = userConfig.exclude;
        if (userConfig.deepAnalysis) CONFIG.deepAnalysis = { ...CONFIG.deepAnalysis, ...userConfig.deepAnalysis };

        // Handle Root Override
        if (userConfig.root) {
            // Resolve relative to this config file
            projectRoot = path.resolve(__dirname, userConfig.root);
        }

        // Handle Git Root Override specifically (if different from project root)
        if (userConfig.gitRoot) {
            git = simpleGit(path.resolve(__dirname, userConfig.gitRoot));
        } else if (userConfig.root) {
            // If root changed, re-init git
            git = simpleGit(projectRoot);
        }
    } catch (e) {
        console.warn('Failed to load iso-config.json, using defaults.', e);
    }
}

// Git initialized above.

async function analyzeProject() {
    console.log(chalk.blue('Starting ISO Compliance Analysis...'));
    console.log(chalk.gray(`Project Root: ${projectRoot}`));
    console.log(chalk.gray(`Using Configuration: ${configPath}`));

    const files = glob.sync(`{${CONFIG.include.join(',')}}`, {
        cwd: projectRoot,
        ignore: CONFIG.exclude,
        absolute: true,
        nodir: true
    });


    console.log(chalk.green(`Found ${files.length} files to analyze.`));

    let projectMetrics = {
        files: [],
        totalLOC: 0,
        totalComments: 0,
        avgMaintainability: 0,
        totalComplexity: 0,
        halstead: {
            bugs: 0,
            difficulty: 0
        }
    };

    let totalMI = 0;

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(projectRoot, file);

        // SLOC
        let fileLOC = 0;
        let fileComments = 0;

        try {
            const stats = sloc(content, 'js');
            fileLOC = stats.source;
            fileComments = stats.comment;
            projectMetrics.totalLOC += fileLOC;
            projectMetrics.totalComments += fileComments;
        } catch (e) {
            // ignore
        }

        // Complexity & Halstead
        let complexityReport = null;
        try {
            complexityReport = escomplex.analyzeModule(content);
        } catch (e) {
            // Syntax error or other parsing issue
        }

        let mi = 0;
        let cyclomatic = 0;
        if (complexityReport) {
            mi = complexityReport.maintainability;
            cyclomatic = complexityReport.aggregate.cyclomatic;
            totalMI += mi;
            projectMetrics.totalComplexity += cyclomatic;
            // projectMetrics.halstead.bugs += complexityReport.aggregate.halstead.bugs;
        }

        projectMetrics.files.push({
            path: relativePath,
            loc: fileLOC,
            comments: fileComments,
            mi: mi,
            complexity: cyclomatic
        });
    }

    if (files.length > 0) {
        projectMetrics.avgMaintainability = totalMI / files.length;
    }

    // Git Analysis
    let gitStats = {
        isRepo: false,
        branch: '',
        commits: 0
    };

    try {
        const isRepo = await git.checkIsRepo();
        if (isRepo) {
            gitStats.isRepo = true;
            const status = await git.status();
            gitStats.branch = status.current;
            const log = await git.log();
            gitStats.commits = log.total;
        }
    } catch (e) {
        console.warn('Git analysis failed:', e.message);
    }

    // Performance Analysis (Estimated Load Time)
    let totalAssetSize = 0;
    try {
        const assets = glob.sync('frontend/public/**/*.{png,jpg,jpeg,ico,json}', { cwd: projectRoot, absolute: true });
        assets.forEach(file => {
            totalAssetSize += fs.statSync(file).size;
        });
    } catch (e) { }

    // Estimate bundle size
    let totalSourceSize = 0;
    files.forEach(file => {
        totalSourceSize += fs.statSync(file).size;
    });

    // Total estimated size in Bytes
    const totalEstSize = totalAssetSize + (totalSourceSize * 0.7); // 0.7 compression ratio assumption
    const speed3G = 1.6 * 1024 * 1024 / 8; // 1.6 Mbps in Bytes/s
    const estLoadTime = (totalEstSize / speed3G).toFixed(2); // seconds

    let perfStats = {
        totalAssetSize,
        totalSourceSize,
        totalEstSize,
        estLoadTime
    };

    const readmeExists = fs.existsSync(path.join(projectRoot, 'README.md'));

    // --- NEW METRICS IMPLEMENTATION ---

    // 1. Hotspot Analysis (Worst 5 files)
    // Score = MI (lower is worse) + Complexity * 2 (higher is worse).
    // Let's normalize to "Badness Score": (100 - MI) + Cyclomatic
    const hotspots = projectMetrics.files
        .map(f => ({
            ...f,
            badness: (100 - f.mi) + f.complexity
        }))
        .sort((a, b) => b.badness - a.badness)
        .slice(0, 5);

    // 2. Secret Scanning & Technical Debt & Reliability
    let secretCount = 0;
    let todoCount = 0;
    let tryCatchCount = 0;
    let functionCount = 0; // Approximate using 'function' keyword or '=>'

    const secretRegex = /(password|secret|api_key|access_token)\s*[:=]\s*['"][a-zA-Z0-9]{10,}['"]/i;
    const todoRegex = /\/\/\s*(TODO|FIXME|HACK):?/i;
    const tryCatchRegex = /try\s*\{/g;
    // Simple function counting heuristic
    const funcRegex = /function\s+\w+|=>|\w+\s*\([^)]*\)\s*\{/g;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (secretRegex.test(content)) secretCount++;
        const todos = content.match(todoRegex);
        if (todos) todoCount += todos.length; // This regex matches per line if we iterate lines, or global? Global needs 'g'

        // Let's do line by line for accurate Tech Debt counting
        const lines = content.split('\n');
        lines.forEach(line => {
            if (todoRegex.test(line)) todoCount++;
        });

        const tries = content.match(tryCatchRegex);
        if (tries) tryCatchCount += tries.length;

        const funcs = content.match(funcRegex);
        if (funcs) functionCount += funcs.length;
    });

    const reliabilityDensity = functionCount > 0 ? (tryCatchCount / functionCount).toFixed(2) : 0;

    // 3. Duplication (Using jscpd programmatic API)
    let duplicationStats = { percentage: 0 };
    try {
        const dupResult = await jscpd(['--silent', '--ignore', '**/*.json,**/*.md', '--pattern', 'backend/**/*.js,frontend/src/**/*.js', projectRoot]);
        duplicationStats.percentage = dupResult.statistics.total.percentage;
    } catch (e) {
        // console.error('Duplication check failed', e);
    }

    // 4. Security Audit (npm audit)
    // We execute npm audit in the backend directory as an example, or root?
    // Let's check root or backend. User has backend/package.json.
    let securityAudit = { vulnerabilities: 0, summary: 'Check manual' };
    try {
        // Run in backend as it's critical
        const backendPath = path.join(projectRoot, 'backend');
        if (fs.existsSync(backendPath)) {
            // --json to parse
            try {
                execSync('npm audit --json', { cwd: backendPath, stdio: 'pipe' });
                // If it succeeds, 0 vulnerabilities found usually, or it exits with 0.
                // Wait, npm audit exits with 1 if vulnerabilities found.
                securityAudit.vulnerabilities = 0;
            } catch (err) {
                // It failed, likely vulnerabilities found
                const output = err.stdout.toString();
                const auditJson = JSON.parse(output);
                securityAudit.vulnerabilities = auditJson.metadata.vulnerabilities.total;
                securityAudit.summary = auditJson.metadata.vulnerabilities;
            }
        }
    } catch (e) {
        // console.error('Audit failed', e);
    }

    // 5. Deep Dependency Analysis (ISO 25010 Modularity & Maintainability)
    let dependencyGraph = { nodes: [], links: [] };
    let deadCode = [];
    let layeringViolations = [];

    // Helper to resolve import paths
    const resolveImport = (sourceFile, importPath) => {
        if (!importPath.startsWith('.')) return null; // Ignore node_modules for now
        try {
            const dir = path.dirname(sourceFile);
            const resolved = path.resolve(dir, importPath);
            // Try adding .js if missing
            if (fs.existsSync(resolved)) return resolved;
            if (fs.existsSync(resolved + '.js')) return resolved + '.js';
            if (fs.existsSync(path.join(resolved, 'index.js'))) return path.join(resolved, 'index.js');
            return null;
        } catch (e) { return null; }
    };

    // Build Graph
    // Regex for imports
    const importRegex = /import\s+(?:.*from\s+)?['"](.*)['"]|require\s*\(\s*['"](.*)['"]\s*\)/g;

    let fileMap = new Map(); // AbsPath -> ID
    projectMetrics.files.forEach(f => fileMap.set(path.resolve(projectRoot, f.path), f.path));

    let inDegree = new Map(); // Path -> Count
    fileMap.forEach((rel, abs) => inDegree.set(abs, 0));

    fileMap.forEach((relSource, absSource) => {
        const content = fs.readFileSync(absSource, 'utf8');
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1] || match[2];
            if (importPath) {
                const absTarget = resolveImport(absSource, importPath);
                if (absTarget && fileMap.has(absTarget)) {
                    // It's an internal dependency
                    dependencyGraph.links.push({ source: relSource, target: fileMap.get(absTarget) });
                    inDegree.set(absTarget, (inDegree.get(absTarget) || 0) + 1);

                    // Check Layering Violation
                    // Use config patterns to determine type
                    // Helper to match path against array of patterns (simple substring/glob assumption)
                    const matchesPattern = (p, patterns) => patterns.some(pat => p.includes(pat.replace(/\*\*\/\*/g, '')));

                    const sourceIsFrontend = matchesPattern(relSource, CONFIG.deepAnalysis.architecture.frontend);
                    const targetIsBackend = matchesPattern(fileMap.get(absTarget), CONFIG.deepAnalysis.architecture.backend);

                    if (sourceIsFrontend && targetIsBackend) {
                        layeringViolations.push({
                            source: relSource,
                            target: fileMap.get(absTarget),
                            message: 'Frontend importing Backend code directly'
                        });
                    }
                }
            }
        }
    });

    // Dead Code Detection
    const entryPointPatterns = CONFIG.deepAnalysis.entryPoints;
    inDegree.forEach((count, absPath) => {
        const relPath = fileMap.get(absPath);
        const fileName = path.basename(relPath).toLowerCase();

        const isEntryPoint = entryPointPatterns.some(p => fileName === p.toLowerCase()) ||
            entryPointPatterns.some(p => relPath.includes(p));

        if (count === 0 && !isEntryPoint) {
            deadCode.push(relPath);
        }
    });

    const deepAnalysis = {
        deadCode,
        layeringViolations,
        dependencyCount: dependencyGraph.links.length
    };

    const simpleReport = {
        metrics: projectMetrics,
        gitStats,
        perfStats,
        readmeExists,
        advanced: {
            hotspots,
            secretCount,
            todoCount,
            reliabilityDensity,
            duplicationStats,
            securityAudit,
            deepAnalysis // Add to report
        }
    };

    // If running as script (node index.js), generate report. Otherwise return object.
    if (require.main === module) {
        generateReport(simpleReport);
    } else {
        return simpleReport;
    }
}

function generateReport(report) {
    const { metrics, gitStats, perfStats, readmeExists, advanced } = report;
    console.log('\n' + chalk.bold.underline('ISO COMPLIANCE READINESS REPORT'));

    // ISO 25010 - Maintainability
    console.log('\n' + chalk.bold.cyan('1. ISO/IEC 25010: Software Quality (Maintainability)'));
    console.log(`   - Total Files Analyzed: ${metrics.files.length}`);
    console.log(`   - Total Lines of Code (Source): ${metrics.totalLOC}`);
    console.log(`   - Comment Density: ${((metrics.totalComments / (metrics.totalLOC + metrics.totalComments)) * 100).toFixed(2)}% ` +
        (metrics.totalComments > 0 ? chalk.green('✔ Evidence found') : chalk.red('✘ Low documentation')));
    console.log(`   - Avg Cyclomatic Complexity: ${(metrics.totalComplexity / metrics.files.length).toFixed(2)}`);
    console.log(`   - Avg Maintainability Index (MI): ${metrics.avgMaintainability.toFixed(2)} / 100 ` +
        (metrics.avgMaintainability > 65 ? chalk.green('✔ High') : chalk.yellow('⚠ Moderate')));

    if (advanced) {
        console.log(`   - Duplication: ${advanced.duplicationStats.percentage}%`);
        console.log(`   - Hotspots Found: ${advanced.hotspots.length}`);
    }

    // ISO 29110 - Process
    console.log('\n' + chalk.bold.cyan('2. ISO/IEC 29110: Implementation Process'));
    console.log(`   - Version Control (Git): ${gitStats.isRepo ? chalk.green('✔ Active') : chalk.red('✘ Not found')}`);
    if (gitStats.isRepo) {
        console.log(`     - Branch: ${gitStats.branch}`);
        console.log(`     - Total Commits: ${gitStats.commits} (Evidence of iterative process)`);
    }
    if (advanced) {
        console.log(`   - Pending Tasks (TODOs): ${advanced.todoCount} ` + (advanced.todoCount > 20 ? chalk.yellow('⚠ High Debt') : chalk.green('✔ Managed')));
    }

    // ISO 9001 - Documentation
    console.log('\n' + chalk.bold.cyan('3. ISO 9001: Quality Management (Documentation)'));
    console.log(`   - Project Readme: ${readmeExists ? chalk.green('✔ Found') : chalk.red('✘ Missing')}`);

    // Performance
    console.log('\n' + chalk.bold.cyan('4. ISO/IEC 25010: Performance Efficiency'));
    console.log(`   - Est. Total Size: ${(perfStats.totalEstSize / 1024).toFixed(2)} KB`);
    console.log(`   - Est. Load Time (3G): ${perfStats.estLoadTime}s ` + (perfStats.estLoadTime < 3 ? chalk.green('✔ Fast') : chalk.yellow('⚠ Optimized needed')));

    // Security
    if (advanced) {
        console.log('\n' + chalk.bold.cyan('5. ISO/IEC 27001: Information Security'));
        console.log(`   - Hardcoded Secrets: ${advanced.secretCount} ` + (advanced.secretCount > 0 ? chalk.red('✘ FOUND!') : chalk.green('✔ Clean')));
        console.log(`   - Vulnerabilities (npm audit): ${advanced.securityAudit.vulnerabilities}`);
        console.log(`   - Reliability (Try/Catch Density): ${advanced.reliabilityDensity}`);
        if (advanced.deepAnalysis) {
            console.log(`   - Dead Code Candidates: ${advanced.deepAnalysis.deadCode.length}`);
        }
    }

    // Save JSON
    fs.writeFileSync(path.join(__dirname, 'iso_report.json'), JSON.stringify(report, null, 2));
    console.log(chalk.gray('\nFull report saved to iso-analyzer/iso_report.json'));
}

if (require.main === module) {
    analyzeProject();
}

module.exports = { analyzeProject };
