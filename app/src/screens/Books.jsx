import React, { useEffect } from 'react';
import '../foliate/view.js';

const Books = () => {
  useEffect(() => {
    window.electron.ipcRenderer.send('readAllBooks');
    const book = async (filepath, name) => {
      const view = document.createElement('foliate-view');
      view.onclick = () => {
        console.log('onclick');
      };
      view.style.width = '105px';
      view.style.height = '137px';

      const { card, cardCover, cardAction, cardBody } = createCard();

      const title = document.createElement('span');
      title.className = 'card-title';
      title.innerText = name;

      title.onclick = () => {
        console.log('click');
      };
      cardBody.append(title);
      cardCover.append(view);

      card.append(cardCover, cardBody, cardAction);
      document.getElementById('books').prepend(card);
      view.addEventListener('relocate', (e) => {
        console.log('location changed');
        console.log(e);
      });

      // can open a File/Blob object or a URL
      // or any object that implements the "book" interface
      //C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub
      await view.open(filepath);

      //await view.open('https://www.sldttc.org/allpdf/21583473018.pdf');
      await view.goTo(0);
    };
    //  book('C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub');
    //  book('https://www.sldttc.org/allpdf/21583473018.pdf');

    // Listen for file-added events
    window.electron.ipcRenderer.on('file-added', (ev, { filePath, name }) => {
      console.log(`File added: `, filePath);

      book(filePath, name);
      // window.electron.ipcRenderer.send('readAllBooks');
    });

    // Listen for file-changed events
    window.electron.ipcRenderer.on('file-changed', (ev, { filePath }) => {
      console.log(`File changed:`, filePath);

      window.electron.ipcRenderer.send('readAllBooks');
    });

    // Listen for file-removed events
    window.electron.ipcRenderer.on('file-removed', (ev, { filePath }) => {
      console.log(`File removed: `, filePath);

      window.electron.ipcRenderer.send('readAllBooks');
    });
    window.electron.ipcRenderer.on('files', (ev, _files) => {
      console.log(`files: `, _files);
      document.getElementById('books').innerHTML = '';
      _files.map(({ filePath, name }) => {
        book(filePath, name);
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

  const createCard = () => {
    const card = document.createElement('div');
    const cardCover = document.createElement('div');
    const cardAction = document.createElement('ul');
    const cardBody = document.createElement('div');
    card.classList.add('card', 'card-bordered');

    cardCover.classList.add('card-cover');
    cardAction.classList.add('card-actions');
    cardBody.classList.add('card-actions');
    return { card, cardCover, cardAction, cardBody };
  };
  return (
    <div
      id="books"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    ></div>
  );
};

export default Books;
