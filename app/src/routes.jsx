import React from 'react';
import { Router, Route } from 'electron-router-dom';

function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<h1>Main</h1>} />
        </>
      }
    />
  );
}

export default AppRoutes;
