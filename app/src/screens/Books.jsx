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
    book('C:/Users/pc/Desktop/projects/ebook/app/src/accessible_epub_3.epub');
    book('https://www.sldttc.org/allpdf/21583473018.pdf');
  }, []);
  return <div id="books">Books</div>;
};

export default Books;
