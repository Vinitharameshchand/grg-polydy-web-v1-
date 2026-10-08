import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

import './styles/fonts.css';
import './styles/global.css';
import './styles/scroll.css';
import './styles/footer.css';
import './styles/hero.css';
import './styles/text.css';
import './styles/wow.css';
import './styles/depth.css';
import './styles/gradients.css';
import './styles/certstrip.css';
import './styles/three.css';

/** Renders one route to an HTML string for the prerender step. */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

export { routes, notFoundMeta } from './routes';
