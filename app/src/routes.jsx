import React, { useEffect, useState } from 'react';
import { Router, Route } from 'electron-router-dom';

import Books from './screens/Books';
import Layout from './components/Layout';
import Book from './screens/Book';
import MyContext from './MyContext';

function AppRoutes() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    function hideError(e) {
      if (
        e.message ===
        'ResizeObserver loop completed with undelivered notifications.'
      ) {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div',
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay',
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    }

    window.addEventListener('error', hideError);
    return () => {
      window.addEventListener('error', hideError);
    };
  }, []);

  return (
    <MyContext.Provider value={{ notes, setNotes }}>
      <Router
        main={
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Books />} />
          </Route>
        }
        book={<Route path="/" element={<Book />} />}
      />
    </MyContext.Provider>
  );
}

export default AppRoutes;
