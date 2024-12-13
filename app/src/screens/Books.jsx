import React, { useEffect } from 'react';
import '../foliate/view.js';
const Books = () => {
  useEffect(() => {
    const book = async (filepath) => {
      const view = document.createElement('foliate-view');
      document.getElementById('books').append(view);

      view.addEventListener('relocate', () => {
        //   console.log('location changed');
        // console.log(e.detail);
      });
      // can open a File/Blob object or a URL
      // or any object that implements the "book" interface
      //C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub
      await view.open(filepath);

      console.log(view);
      //await view.open('https://www.sldttc.org/allpdf/21583473018.pdf');
      await view.goTo(1);
    };
    //  book('C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub');
    //  book('https://www.sldttc.org/allpdf/21583473018.pdf');

    // Listen for file-added events
    window.electron.ipcRenderer.on('file-added', (ev , filePath) => {
      console.log(`File added: `, filePath);
    });

    // Listen for file-changed events
    window.electron.ipcRenderer.on('file-changed', (ev , filePath) => {
      console.log(`File changed:`, filePath);
    });

    // Listen for file-removed events
    window.electron.ipcRenderer.on('file-removed', (ev , filePath) => {
      console.log(`File removed: `, filePath);
    });
    return () => {
      // Cleanup listeners
      window.electron.ipcRenderer.removeAllListeners('file-added');
      window.electron.ipcRenderer.removeAllListeners('file-changed');
      window.electron.ipcRenderer.removeAllListeners('file-removed');
    };
  }, []);
  return <div id="books">Books</div>;
};

export default Books;
