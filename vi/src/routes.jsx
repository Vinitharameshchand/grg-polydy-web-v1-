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

/**
 * Route table. `meta` drives both the runtime <title>/description and the
 * static tags baked into each prerendered HTML file, so the two can never
 * drift apart.
 */
export const routes = [
  {
    path: '/',
    element: <Home />,
    meta: {
      title: 'GRG Polydynamics — Precision Plastic Injection Moulding, Chennai',
      description:
        'Precision, high-quality plastic injection moulded components for automotive, electrical, machine and consumer product customers. IATF 16949 and ISO 14001:2015 certified. Sriperumbudur, Chennai.'
    }
  },
  {
    path: '/about',
    element: <About />,
    meta: {
      title: 'About — GRG Polydynamics Private Limited',
      description:
        'Part of a professionally managed group with three decades of business endeavours and turnover above Rs.300 crores. The plastics division was established in 2011 at Sriperumbudur, Chennai.'
    }
  },
  {
    path: '/capabilities',
    element: <Capabilities />,
    meta: {
      title: 'Capabilities — Injection Moulding, Mould Making & Finishing | GRG Polydynamics',
      description:
        'Product development, prototyping, mould making, precision plastic injection moulding, painting and chrome plating, screen and pad printing, metal casting and tooling transfer support.'
    }
  },
  {
    path: '/industries',
    element: <Industries />,
    meta: {
      title: 'Industries — Automotive, Electrical, Machine & Consumer | GRG Polydynamics',
      description:
        'Automotive, electrical and electronics, industrial machine and consumer product customers served with precision plastic injection moulded components under one quality system.'
    }
  },
  {
    path: '/products',
    element: <Products />,
    meta: {
      title: 'Products — Precision Moulded Components | GRG Polydynamics',
      description:
        'Structural mouldings, appearance-critical trim and finished assemblies — moulded, painted, chrome plated and printed in-house at Sriperumbudur, Chennai.'
    }
  },
  {
    path: '/npd',
    element: <NPD />,
    meta: {
      title: 'Product Development — GRG Polydynamics',
      description:
        'A dedicated NPD team supporting complete product development and production readiness: feasibility, DFM, tooling, validation, PPAP and mass production launch.'
    }
  },
  {
    path: '/quality',
    element: <Quality />,
    meta: {
      title: 'Quality & Certifications — IATF 16949, ISO 14001:2015 | GRG Polydynamics',
      description:
        'IATF 16949, ISO 14001:2015, SQ Mark and ESG certifications — the quality, environmental and ethical commitments behind our manufacturing.'
    }
  },
  {
    path: '/sustainability',
    element: <Sustainability />,
    meta: {
      title: 'Sustainability, Governance & Policies — GRG Polydynamics',
      description:
        'Published policies covering labour and human rights, health and safety, governance and environmental management, plus the Sustainability Report 2024-2025.'
    }
  },
  {
    path: '/facility',
    element: <Facility />,
    meta: {
      title: 'Facility — Inside the Plant | GRG Polydynamics',
      description:
        'Production floor, injection moulding machines, tool room, quality laboratory and engineering office at Vallakottai, Sriperumbudur, Chennai.'
    }
  },
  {
    path: '/contact',
    element: <Contact />,
    meta: {
      title: 'Contact — GRG Polydynamics Private Limited, Sriperumbudur',
      description:
        'Contact GRG Polydynamics at Vallakottai, Sriperumbudur, Chennai 631604 for injection moulding, mould making, metal casting, tooling transfer and NPD enquiries.'
    }
  }
];

/** Routes that should appear in sitemap.xml. */
export const sitemapPaths = routes.map((r) => r.path);

export { Layout, NotFound };
