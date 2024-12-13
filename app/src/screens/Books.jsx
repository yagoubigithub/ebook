import React, { useEffect } from 'react';
import '../foliate/view.js';
const Books = () => {
  useEffect(() => {
    window.electron.ipcRenderer.send('readAllBooks');
    const book = async (filepath) => {
      const view = document.createElement('foliate-view');
      view.style.width = '100px';
      view.style.height = '220px';

      document.getElementById('books').prepend(view);

      view.addEventListener('relocate', (e) => {
        console.log('location changed');
        console.log(e.detail);
      });
      // can open a File/Blob object or a URL
      // or any object that implements the "book" interface
      //C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub
      await view.open(filepath);

      console.log(view);
      //await view.open('https://www.sldttc.org/allpdf/21583473018.pdf');
      await view.goTo(0);
    };
    //  book('C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub');
    //  book('https://www.sldttc.org/allpdf/21583473018.pdf');

    // Listen for file-added events
    window.electron.ipcRenderer.on('file-added', (ev, filePath) => {
      console.log(`File added: `, filePath);

      book(filePath);
     // window.electron.ipcRenderer.send('readAllBooks');
    });

    // Listen for file-changed events
    window.electron.ipcRenderer.on('file-changed', (ev, filePath) => {
      console.log(`File changed:`, filePath);

      window.electron.ipcRenderer.send('readAllBooks');
    });

    // Listen for file-removed events
    window.electron.ipcRenderer.on('file-removed', (ev, filePath) => {
      console.log(`File removed: `, filePath);

      window.electron.ipcRenderer.send('readAllBooks');
    });
    window.electron.ipcRenderer.on('files', (ev, _files) => {
      console.log(`files: `, _files);
      document.getElementById('books').innerHTML = 'Books';
      _files.map((path) => {
        book(path);
      });
    });
    return () => {
      // Cleanup listeners
      window.electron.ipcRenderer.removeAllListeners('file-added');
      window.electron.ipcRenderer.removeAllListeners('file-changed');
      window.electron.ipcRenderer.removeAllListeners('file-removed');
      window.electron.ipcRenderer.removeAllListeners('files');
    };
  }, []);
  return (
    <div
      id="books"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      Books
    </div>
  );
};

export default Books;
