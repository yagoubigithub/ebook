import { app, BrowserWindow, ipcMain, screen } from 'electron';

import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import createWindow from './windows/createWindow.js';

import createDatabase from './db.js';

/**
 * the main window of our porject
 * @type {BrowserWindow}
 */
let mainWindow;
let book;
let db;

app.whenReady().then(async () => {
  db = await createDatabase();
  console.log('Database initialized');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = createWindow('main', {});
  book = createWindow('book', { show: false, width, height });
  book.on('close', (e) => {
    e.preventDefault();
    book.hide();
  });
  mainWindow.on('close', (e) => {
    app.quit();
    app.exit(0);
  });

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
  if (!fs.existsSync(path.join(process.resourcesPath, 'uplaod'))) {
    fs.mkdirSync(path.join(process.resourcesPath, 'uplaod'));
  }
  fs.copyFileSync(
    file.path,
    path.join(process.resourcesPath, 'uplaod', file.name),
  );
});

ipcMain.on('readAllBooks', () => {
  try {
    console.log(path.join(process.resourcesPath, 'uplaod'));
    if (!fs.existsSync(path.join(process.resourcesPath, 'uplaod'))) {
      fs.mkdirSync(path.join(process.resourcesPath, 'uplaod'));
    }
  } catch (error) {
    console.log(error);
  }

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

ipcMain.on('open-book', (ev, filePath) => {
  book.webContents.send('file-to-display', {
    filePath,
    name: path.basename(filePath),
  });
  book.show();
  book.maximize();
});

ipcMain.handle('get-notes', async () => {
  db = await createDatabase();
  // eslint-disable-next-line no-return-await
  return await db.all('SELECT * FROM notes');
});

ipcMain.on('add-note', async (event, notes) => {
  console.log(notes);
  db = await createDatabase();
  let query = `INSERT INTO notes  `;
  let names = `(text `;
  let v = `(?`;
  notes.note.forEach((note) => {
    names += `,"column-${note.columnId}"`;
    v += ',?';
  });

  names += `)`;
  v += ')';
  query += `${names} VALUES ${v}`;
  console.log(query);
  await db.run(query, [notes.text, ...notes.note.map((n) => n.note)]);
});

ipcMain.handle('get-columns', async () => {
  db = await createDatabase();
  // eslint-disable-next-line no-return-await
  return await db.all('SELECT * FROM columns');
});

ipcMain.on('add-column', async (event, column) => {
  db = await createDatabase();
  const result = await db.run(
    'INSERT INTO columns (name, desc) VALUES (?, ?)',
    [column.name, column.desc],
  );
  // Get the last inserted ID
  const insertedId = result.lastID;

  console.log(`Inserted row ID: ${insertedId}`);

  await db.exec(`ALTER TABLE notes ADD "column-${insertedId}" TEXT`);
});
