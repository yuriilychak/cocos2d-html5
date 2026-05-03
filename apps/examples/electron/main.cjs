'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;

function createWindow() {
    const win = new BrowserWindow({
        width: CANVAS_WIDTH + 40,
        height: CANVAS_HEIGHT + 80,
        title: 'Cocos2d-HTML5 Test Cases',
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile(path.join(__dirname, '..', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
