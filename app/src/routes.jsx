import React from 'react';
import { Router, Route } from 'electron-router-dom';

import Home from './screens/Home';
import Layout from './components/Layout';

function AppRoutes() {
  return (
    <Router
      main={
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      }
    />
  );
}

export default AppRoutes;
