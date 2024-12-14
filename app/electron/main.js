import { app, BrowserWindow, ipcMain } from 'electron';

import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import createWindow from './windows/createWindow.js';

/**
 * the main window of our porject
 * @type {BrowserWindow}
 */
let mainWindow;

app.whenReady().then(() => {
  mainWindow = createWindow('main', {});
  mainWindow.show();

  app.on('activate', () => {
    /**
     *  On macOS it's common to re-create a window in the app when the
     *  dock icon is clicked and there are no other windows open.
     */
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow('main', {});
    }
  });
});

/**
 * Quit when all windows are closed, except on macOS. There, it's common
 * for applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('import', (ev, file) => {
  fs.copyFileSync(
    file.path,
    path.join(process.resourcesPath, 'uplaod', file.name),
  );
});

ipcMain.on('readAllBooks', () => {
  const files = fs.readdirSync(path.join(process.resourcesPath, 'uplaod'));
  mainWindow.webContents.send(
    'files',
    files.map((file) => ({
      filePath: path.join(process.resourcesPath, 'uplaod', file),
      name: file,
    })),
  );
});

// Initialize chokidar
const watcher = chokidar.watch(path.join(process.resourcesPath, 'uplaod'), {
  // eslint-disable-next-line no-useless-escape
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
  persistent: true,
});

watcher
  .on('add', (filePath) => {
    mainWindow.webContents.send('file-added', {
      filePath,
      name: path.basename(filePath),
    });
  })
  .on('change', (filePath) => {
    mainWindow.webContents.send('file-changed', {
      filePath,
      name: path.basename(filePath),
    });
  })
  .on('unlink', (filePath) => {
    mainWindow.webContents.send('file-removed', {
      filePath,
      name: path.basename(filePath),
    });
  });
