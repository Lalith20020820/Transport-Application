const http = require('http');
const fs = require('fs');
const path = require('path');
const { shell } = require('electron');
const os = require('os');

const PORT = 8999;
const BACKUP_DIR = path.join(os.homedir(), 'Documents', 'Transport_Data');

// Ensure Backup Dir Exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // --- API ENDPOINTS ---

    // 1. Open Backup Folder
    if (req.url === '/api/open-folder') {
        shell.openPath(BACKUP_DIR).then(err => {
            if (err) console.error("Failed to open path:", err);
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, path: BACKUP_DIR }));
        return;
    }

    // 2. Save Backup (POST)
    if (req.url === '/api/backup' && req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                // Save to Documents/Transport_Data/Transport_AutoBackup.xlsx
                const filePath = path.join(BACKUP_DIR, 'Transport_AutoBackup.xlsx');
                fs.writeFileSync(filePath, buffer);
                console.log("Auto-Backup saved to:", filePath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error("Backup Save Failed:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // --- STATIC FILE SERVING ---
    let basePath = __dirname;
    let safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');

    let filePath = path.join(basePath, safePath);

    // Default to index.html for root
    if (req.url === '/' || req.url === '') {
        filePath = path.join(basePath, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Security Check: Ensure we stand inside __dirname
    if (!filePath.startsWith(basePath)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.error("404 Error serving:", filePath, error.code);
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found: ' + req.url);
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

module.exports = {
    start: () => {
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
            // Launch Browser
            shell.openExternal(`http://localhost:${PORT}/`);
        });
    }
};
