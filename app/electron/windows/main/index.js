import { BrowserWindow, app } from 'electron';

import path from 'path';
import __dirname from '../../__dirname';

export default function createWindow() {
  // our window you can chanege the size  and other

  const window = new BrowserWindow({
    show: true,
    height: 500,
    width: 800,

    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
    },
  });

  if (app.isPackaged) {
    window.loadFile('./app/dist/index.html');

    // window.setMenu(null);
  } else {
    window.loadURL('http://localhost:40992');
  }

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    // window.webContents.openDevTools();
  }

  window.on('close', () => {
    app.quit();
    app.exit(0);
  });
  return window;
}
