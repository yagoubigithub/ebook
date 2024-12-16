import React, { useState } from 'react';
import { Router, Route } from 'electron-router-dom';

import Books from './screens/Books';
import Layout from './components/Layout';
import Book from './screens/Book';
import MyContext from './MyContext';

function AppRoutes() {
  const [notes, setNotes] = useState([]);
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
