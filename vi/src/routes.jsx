import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Capabilities from './pages/Capabilities';
import Industries from './pages/Industries';
import Products from './pages/Products';
import NPD from './pages/NPD';
import Quality from './pages/Quality';
import Sustainability from './pages/Sustainability';
import Facility from './pages/Facility';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { pageMeta, notFoundMeta } from './data/meta';

/**
 * Route table. `meta` comes from data/meta.js, which usePageMeta also reads at
 * runtime, so the prerendered tags and the post-hydration title match.
 */
export const routes = [
  {
    path: '/',
    element: <Home />,
    meta: pageMeta['/']
  },
  {
    path: '/about',
    element: <About />,
    meta: pageMeta['/about']
  },
  {
    path: '/capabilities',
    element: <Capabilities />,
    meta: pageMeta['/capabilities']
  },
  {
    path: '/industries',
    element: <Industries />,
    meta: pageMeta['/industries']
  },
  {
    path: '/products',
    element: <Products />,
    meta: pageMeta['/products']
  },
  {
    path: '/npd',
    element: <NPD />,
    meta: pageMeta['/npd']
  },
  {
    path: '/quality',
    element: <Quality />,
    meta: pageMeta['/quality']
  },
  {
    path: '/sustainability',
    element: <Sustainability />,
    meta: pageMeta['/sustainability']
  },
  {
    path: '/facility',
    element: <Facility />,
    meta: pageMeta['/facility']
  },
  {
    path: '/contact',
    element: <Contact />,
    meta: pageMeta['/contact']
  }
];

/** Routes that should appear in sitemap.xml. */
export const sitemapPaths = routes.map((r) => r.path);

export { Layout, NotFound, notFoundMeta };
