import { BrowserWindow, app } from 'electron';

import path from 'path';
import __dirname from '../__dirname.js';

/**
 *
 * Create any window with our peoject
 * @method
 * @returns {BrowserWindow}   window object
 */

function createWindow() {
  /**
   * the window object
   * @type {BrowserWindow}
   */
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

export default createWindow;
