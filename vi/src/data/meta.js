/**
 * Per-route <title> and meta description — the ONE place they are written.
 * routes.jsx reads this for the prerendered HTML and usePageMeta reads it at
 * runtime, so what crawlers see and what the tab shows after hydration are
 * always the same string.
 */
export const pageMeta = {
  '/': {
    title: 'GRG Polydynamics — Precision Plastic Injection Moulding, Chennai',
    description:
      'Precision, high-quality plastic injection moulded components for automotive, electrical, machine and consumer product customers. IATF 16949 and ISO 14001:2015 certified. Sriperumbudur, Chennai.'
  },
  '/about': {
    title: 'About — GRG Polydynamics Private Limited',
    description:
      'Part of a professionally managed group with three decades of business endeavours and turnover above ₹300 crores. The plastics division was established in 2011 at Sriperumbudur, Chennai.'
  },
  '/capabilities': {
    title: 'Capabilities — Injection Moulding, Mould Making & Finishing | GRG Polydynamics',
    description:
      'Product development, prototyping, mould making, precision plastic injection moulding, painting and chrome plating, screen and pad printing, metal casting and tooling transfer support.'
  },
  '/industries': {
    title: 'Industries — Automotive, Electrical, Machine & Consumer | GRG Polydynamics',
    description:
      'Automotive, electrical and electronics, industrial machine and consumer product customers served with precision plastic injection moulded components under one quality system.'
  },
  '/products': {
    title: 'Products — Precision Moulded Components | GRG Polydynamics',
    description:
      'Structural mouldings, appearance-critical trim and finished assemblies — moulded, painted, chrome plated and printed in-house at Sriperumbudur, Chennai.'
  },
  '/npd': {
    title: 'Product Development — GRG Polydynamics',
    description:
      'A dedicated NPD team supporting complete product development and production readiness: feasibility, DFM, tooling, validation, PPAP and mass production launch.'
  },
  '/quality': {
    title: 'Quality & Certifications — IATF 16949, ISO 14001:2015 | GRG Polydynamics',
    description:
      'IATF 16949, ISO 14001:2015, SQ Mark and ESG certifications — the quality, environmental and ethical commitments behind our manufacturing.'
  },
  '/sustainability': {
    title: 'Sustainability, Governance & Policies — GRG Polydynamics',
    description:
      'Published policies covering labour and human rights, health and safety, governance and environmental management, plus the Sustainability Report 2024–2025.'
  },
  '/facility': {
    title: 'Facility — Inside the Plant | GRG Polydynamics',
    description:
      'Production floor, injection moulding machines, tool room, quality laboratory and engineering office at Vallakottai, Sriperumbudur, Chennai.'
  },
  '/contact': {
    title: 'Contact — GRG Polydynamics Private Limited, Sriperumbudur',
    description:
      'Contact GRG Polydynamics at Vallakottai, Sriperumbudur, Chennai 631604 for injection moulding, mould making, metal casting, tooling transfer and NPD enquiries.'
  }
};

export const notFoundMeta = {
  title: 'Page not found — GRG Polydynamics',
  description: 'The page you requested does not exist.'
};

/** Meta for a pathname; tolerates a trailing slash. Unknown paths get the 404 meta. */
export function metaFor(pathname) {
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return pageMeta[key] || notFoundMeta;
}
