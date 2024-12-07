import { app, BrowserWindow } from 'electron';

import createWindow from './windows/createWindow.js';

/**
 * the main window of our porject
 * @type {BrowserWindow}
 */
let mainWindow;

app.whenReady().then(() => {
  mainWindow = createWindow();
  mainWindow.show();

  app.on('activate', () => {
    /**
     *  On macOS it's common to re-create a window in the app when the
     *  dock icon is clicked and there are no other windows open.
     */
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
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
