import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.scss';

/**
 *
 */
const container = document.getElementById('target');
const root = createRoot(container);

root.render(<>Hello world from React</>);
