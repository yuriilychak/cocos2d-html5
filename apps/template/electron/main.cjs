'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');

const CANVAS_WIDTH = 321;
const CANVAS_HEIGHT = 480;

function createWindow() {
    const win = new BrowserWindow({
        width: CANVAS_WIDTH + 40,
        height: CANVAS_HEIGHT + 60,
        title: 'Cocos2d-html5 Hello World',
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
