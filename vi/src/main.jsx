import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/fonts.css';
import './styles/global.css';
import './styles/scroll.css';
import './styles/footer.css';
import './styles/hero.css';
import './styles/text.css';
import './styles/wow.css';
import './styles/depth.css';
import './styles/certstrip.css';
import './styles/three.css';
import './styles/polish.css';
import './styles/system.css';

const root = document.getElementById('root');

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/* Pages are prerendered to static HTML, so attach to the existing markup
   instead of throwing it away. Falls back to a fresh render in dev. */
if (root.dataset.prerendered === 'true') {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
