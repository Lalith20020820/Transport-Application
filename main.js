const { app, BrowserWindow, shell, Tray, Menu } = require('electron');
const path = require('path');
const server = require('./server');

let win;

function createWindow() {
    // Minimize to tray or show small status window
    win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: false, // Not needed for status window
            contextIsolation: true
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png') // If exists
    });

    // Load a status page
    const statusHtml = `
    <html>
        <body style="font-family: sans-serif; text-align: center; padding: 20px; background: #0f172a; color: white;">
            <h2 style="color: #3b82f6;">Transport Server Running</h2>
            <p>The application is open in your web browser.</p>
            <p style="font-size: 12px; color: #94a3b8;">Do not close this window while using the app.</p>
            <button onclick="require('electron').shell.openExternal('http://localhost:8999')" style="padding: 10px 20px; cursor: pointer; background: #3b82f6; border: none; color: white; border-radius: 5px;">Re-Open Browser</button>
        </body>
    </html>
    `;
    win.loadURL('data:text/html;charset=utf-8,' + encodeURI(statusHtml));

    // Handle close to minimize? Or just quit.
    // User expects closing 'app' to stop everything.
}

app.whenReady().then(() => {
    // Start Local Server
    server.start();

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
