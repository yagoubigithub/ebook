import { BrowserWindow, app } from 'electron';

import { createFileRoute, createURLRoute } from 'electron-router-dom';

import path from 'path';
import __dirname from '../__dirname.js';

/**
 *
 * Create any window with our peoject
 * @method
 * @returns {BrowserWindow}   window object
 */

function createWindow(id, options = {}) {
  /**
   * the window object
   * @type {BrowserWindow}
   */
  const window = new BrowserWindow({
    show: true,
    height: 500,
    width: 800,
    ...options,

    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
    },
  });

  const devServerURL = createURLRoute('http://localhost:40992', id);

  const fileRoute = createFileRoute(
    path.join(__dirname, './app/dist/index.html'),
    id,
  );
  if (app.isPackaged) {
    window.loadFile(...fileRoute);

    // window.setMenu(null);
  } else {
    window.loadURL(devServerURL);
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
