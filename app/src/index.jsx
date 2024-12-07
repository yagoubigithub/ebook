import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.scss';
import AppRoutes from './routes';

/**
 *
 */
const container = document.getElementById('target');
const root = createRoot(container);

root.render(
  <>
    <AppRoutes />
  </>,
);
