import React from 'react';
import { Router, Route } from 'electron-router-dom';

import Books from './screens/Books';
import Layout from './components/Layout';

function AppRoutes() {
  return (
    <Router
      main={
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Books />} />
        </Route>
      }
      book={<Route path="/" element={<h1>test</h1>} />}
    />
  );
}

export default AppRoutes;
