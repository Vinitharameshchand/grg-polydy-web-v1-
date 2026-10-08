/**
 * Single source of truth for company facts, navigation and page content.
 * Facts trace to reference.md (client brief) and reference-oldsite.md (previous site).
 */

export const company = {
  legalName: 'GRG Polydynamics Private Limited',
  shortName: 'GRG Polydynamics',
  tagline: 'Precision Injection Moulding',
  street: '2/2A, Vallam A Village, Palnallur Village',
  locality: 'Vallakottai, Sriperumbudur',
  city: 'Chennai',
  postalCode: '631604',
  region: 'Tamil Nadu',
  country: 'India',
  phone: '+91 87544 53333',
  phoneHref: '+918754453333',
  phoneAlt: '+91 93808 82221',
  phoneAltHref: '+919380882221',
  whatsapp: 'https://api.whatsapp.com/send/?phone=919380882221',
  email: 'vkumar@grgpolydynamics.com',
  founded: '2011'
};

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/industries', label: 'Industries' },
  { to: '/products', label: 'Products' },
  { to: '/npd', label: 'Development' },
  { to: '/quality', label: 'Quality' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/contact', label: 'Contact' }
];

export const stats = [
  { value: '3 decades', label: 'Group business' },
  { value: '₹300 Cr+', label: 'Group turnover' },
  { value: '2011', label: 'Plastics division' },
  { value: '4', label: 'Industries served' }
];

export const certifications = [
  {
    name: 'IATF 16949',
    kind: 'Automotive QMS',
    text: 'The automotive sector quality management standard. It governs traceability, change control, control plans and corrective action across our production.'
  },
  {
    name: 'ISO 14001:2015',
    kind: 'Environment',
    text: 'Environmental management system covering identification and control of environmental aspects across materials, waste and plant operations.'
  },
  {
    name: 'SQ Mark',
    kind: 'Supplier quality',
    text: 'Supplier quality recognition, confirming consistent conformance, delivery discipline and audit readiness as a supply partner.'
  },
  {
    name: 'ESG Certificate',
    kind: 'Sustainability',
    text: 'Environmental, social and governance certification covering sustainable and ethical manufacturing practice across the organisation.'
  }
];

export const services = [
  {
    id: 'product-development',
    title: 'Product Development',
    short: 'Requirement review, feasibility and design evaluation.',
    text: 'Programmes start with a requirement review, not a quotation. We evaluate the design against our process capability and flag manufacturability risk while change is still inexpensive.',
    points: [
      'Customer requirement review and feasibility study',
      'Design for Manufacturability (DFM) analysis',
      'Material selection and validation',
      'Dimensional verification against drawing'
    ],
    image: 'office-npd',
    alt: 'Engineering team reviewing a component programme'
  },
  {
    id: 'prototyping',
    title: 'Prototyping',
    short: 'Form, fit and function proven before production tooling.',
    text: 'Physical samples validate the design before production tooling is committed, so geometry problems surface while they are still cheap to correct.',
    points: [
      'Prototype samples for form, fit and function',
      'Iteration against customer feedback',
      'Dimensional verification before tool release'
    ],
    image: 'inspection-gauge',
    alt: 'Component being measured during inspection'
  },
  {
    id: 'mould-making',
    title: 'Mould Making',
    short: 'Tool design, manufacture and qualification in-house.',
    text: 'Tool concept, cavitation and layout are developed and formally approved with the customer before steel is cut. Moulds are then qualified against a defined acceptance standard.',
    points: [
      'Tooling concept development',
      'Tool design and customer approval',
      'Mould manufacturing and qualification',
      'Trial validation and preventive maintenance'
    ],
    image: 'mould-handling',
    alt: 'Injection mould being handled in the tool room'
  },
  {
    id: 'injection-moulding',
    title: 'Plastic Part Production',
    short: 'High-volume precision injection moulding.',
    text: 'Precision injection moulded components produced at volume under controlled and continuously monitored process parameters.',
    points: [
      'Precision injection moulded components',
      'Automotive and industrial applications',
      'High-volume manufacturing',
      'Process optimisation and quality control'
    ],
    image: 'moulding-machines',
    alt: 'Injection moulding machines on the production floor'
  },
  {
    id: 'finishing',
    title: 'Painting & Chrome Plating',
    short: 'Decorative and functional surface finishing.',
    text: 'Appearance-critical parts are finished in-house. Keeping decoration on the same site as moulding shortens the loop between a surface defect and the parameter that caused it.',
    points: [
      'Painting for decorative and functional finishes',
      'Chrome plating on moulded components',
      'Cosmetic inspection against agreed standards'
    ],
    image: 'product-bezel-gloss',
    alt: 'Gloss-finished moulded bezel component'
  },
  {
    id: 'printing',
    title: 'Screen & Pad Printing',
    short: 'Graphics, legends and markings on finished parts.',
    text: 'Screen and pad printing applied in-house to finished mouldings, so marked parts never leave the plant for decoration.',
    points: ['Screen printing', 'Pad printing for graphics and legends', 'Marking and legend application'],
    image: 'product-vent',
    alt: 'Finished moulded vent component with printed detail'
  }
];

export const capabilitiesExtra = [
  {
    id: 'metal-casting',
    title: 'Metal Casting',
    text: 'Industrial metal casting solutions for engineering-grade components, with custom manufacturing support from concept through repeatable precision production.',
    points: [
      'Industrial metal casting solutions',
      'Engineering-grade components',
      'Custom manufacturing support',
      'Precision production capability'
    ],
    image: 'product-bracket-white',
    alt: 'Engineering-grade cast and moulded bracket'
  },
  {
    id: 'tooling-transfer',
    title: 'Tooling Transfer Support',
    text: 'Moving a tool between suppliers or plants is a controlled engineering exercise, not a logistics one. We take responsibility for the transfer, the assessment and the stabilisation of the process that follows.',
    points: [
      'Mould transfer and validation',
      'Preventive maintenance (PM)',
      'PREP assessment and process stabilisation',
      'Production transition support',
      'Trial validation and optimisation'
    ],
    image: 'mould-storage',
    alt: 'Mould storage racks in the plant'
  }
];

export const industries = [
  {
    id: 'automotive',
    title: 'Automotive',
    short: 'Moulded components produced to automotive traceability and control-plan standards.',
    text: 'The plastics division was established in 2011 to serve automotive customers, and automotive discipline still sets the standard for everything else we run. IATF 16949 governs traceability, control plans and change management on every automotive part number.',
    points: [
      'Precision moulded components for automotive assemblies',
      'PPAP and APQP documentation as standard deliverables',
      'Control-plan driven production with in-process inspection',
      'Located inside the Sriperumbudur automotive belt'
    ],
    image: 'product-frame',
    alt: 'A moulded structural component produced at the plant'
  },
  {
    id: 'electrical',
    title: 'Electrical & Electronics',
    short: 'Insulating housings and enclosures in engineering-grade polymers.',
    text: 'Electrical and electronics components carry safety and insulation requirements that make material selection and process consistency inseparable from the part itself. Both are validated before a tool is released to production.',
    points: [
      'Insulating housings, enclosures and switchgear parts',
      'Engineering-grade polymer selection and validation',
      'Dimensional stability for assembly and contact fit',
      'Traceable material and process records'
    ],
    image: 'product-bracket',
    alt: 'A moulded housing component produced at the plant'
  },
  {
    id: 'machine',
    title: 'Industrial & Machine',
    short: 'Functional components where repeatability decides assembly fit.',
    text: 'Functional machine components are judged on whether they assemble and keep working. Repeatability across a production run — not a single good sample — is what our process lock-down and preventive maintenance schedule exist to protect.',
    points: [
      'Functional components for industrial machinery',
      'Tight dimensional tolerance and stability',
      'Custom manufacturing support, including metal casting',
      'Low- and high-volume programmes'
    ],
    image: 'moulding-machine-detail',
    alt: 'An injection moulding machine on the production floor'
  },
  {
    id: 'consumer',
    title: 'Consumer Products',
    short: 'Appearance-critical parts finished in-house.',
    text: 'Consumer parts are appearance-critical, and appearance defects are process defects. In-house painting, chrome plating and pad printing keep decoration on the same site as moulding.',
    points: [
      'Appearance-critical moulded components',
      'In-house painting and chrome plating',
      'Screen and pad printing for graphics and legends',
      'Cosmetic inspection against agreed acceptance standards'
    ],
    image: 'product-grille',
    alt: 'A finished, decorated moulding produced at the plant'
  }
];

export const npdStages = [
  ['Customer requirement review and feasibility study', 'Drawings, volumes, application conditions and timing are reviewed against our process capability before any commitment is made.'],
  ['Product design evaluation and DFM analysis', 'Design for Manufacturability analysis identifies mouldability, draft, wall section, gating and tolerance risks while change is still inexpensive.'],
  ['Tooling concept development and tool design approval', 'Tool concept, cavitation and layout are developed and formally approved with the customer before cutting steel.'],
  ['Mould manufacturing and qualification', 'Moulds are manufactured and qualified against a defined acceptance standard covering fit, function and dimensional output.'],
  ['Material selection and validation', 'Grades are selected against application requirements and validated for processing behaviour and end-use performance.'],
  ['Process parameter development and optimisation', 'Parameters are systematically developed, optimised for cycle and quality, then captured for release to production.'],
  ['Sample production and dimensional verification', 'Samples are produced under released parameters and dimensionally verified against drawing before submission.'],
  ['PPAP, APQP, FMEA, Control Plan and quality documentation', 'The full documentation package is prepared and submitted — production part approval, advanced planning, failure mode analysis and the control plan production will run to.'],
  ['Customer approval and production readiness review', 'Approval is obtained and a readiness review confirms tooling, process, material, manpower and documentation are all in place.'],
  ['Mass production launch and continuous improvement', 'The line is launched and monitored, with performance data feeding back into parameters, maintenance intervals and documentation.']
];

/**
 * Policy library. PDFs are self-hosted in public/docs/ so they keep working
 * when grgpolydynamics.com is repointed at this site.
 * `false` as the third element = PDF not yet supplied (it 404ed on the old
 * site), rendered as "On request" rather than a dead link. To publish one,
 * add the file to public/docs/ under the name given here and drop the flag.
 */
export const DOC_BASE = '/docs/';

export const policyGroups = [
  {
    id: 'labour',
    title: 'Labour & Human Rights',
    note: 'How people are hired, paid, protected and heard.',
    docs: [
      ['Child Labour Policy', 'child-labour-policy.pdf'],
      ['Forced Labour Policy', 'forced-labour-policy.pdf'],
      ['Anti-Harassment Policy', 'anti-harassment-policy.pdf'],
      ['POSH Policy', 'posh-policy.pdf'],
      ['Ethical Hiring Policy', 'ethical-hiring-policy.pdf'],
      ['Recruitment Policy', 'recruitment-policy.pdf'],
      ['Company HR Policy', 'company-hr-policy.pdf'],
      ['Grievance Handling Policy', 'grievance-handling-policy.pdf'],
      ['Wage Policy', 'wage-policy.pdf'],
      ['Wage Equality Policy', 'wage-equality-policy.pdf'],
      ['Employee Privacy Policy', 'employee-privacy-policy.pdf'],
      ['Parental Leave Policy', 'parental-leave-policy.pdf'],
      ['Maternity Policy', 'maternity-policy.pdf'],
      ['Remote Working Policy', 'remote-working-policy.pdf']
    ]
  },
  {
    id: 'safety',
    title: 'Health & Safety',
    note: 'Occupational safety on the shop floor and across the site.',
    docs: [
      ['Health and Safety Policy', 'health-and-safety-policy.pdf'],
      ['Occupational Health and Safety Policy', 'occupational-health-and-safety-policy.pdf', false]
    ]
  },
  {
    id: 'governance',
    title: 'Governance & Ethics',
    note: 'How we conduct business and handle disclosure.',
    docs: [
      ['Ethics Policy', 'ethics-policy.pdf'],
      ['Gift and Hospitality Policy', 'gift-and-hospitality-policy.pdf'],
      ['Whistleblower Policy', 'whistleblower-policy.pdf']
    ]
  },
  {
    id: 'environment',
    title: 'Environment, Energy & Waste',
    note: 'The ISO 14001:2015 management system, documented.',
    docs: [
      ['Environment Policy', 'environment-policy.pdf'],
      ['Environmental Roles and Responsibilities', 'environmental-roles-and-responsibilities.pdf'],
      ['Biodiversity Policy', 'biodiversity-policy.pdf'],
      ['Energy Policy', 'energy-policy.pdf'],
      ['Energy Usage Policy', 'energy-usage-policy.pdf'],
      ['GHG Reduction Goal Policy', 'ghg-reduction-goal-policy.pdf'],
      ['Waste Management Policy', 'waste-management-policy.pdf'],
      ['Internal SOPs for Waste Handling', 'internal-sops-for-waste-handling.pdf'],
      ['Hazardous Waste Storage & Handling SOP', 'hazardous-waste-storage-and-handling-sop.pdf'],
      ['Wastewater Management Plan – SOP', 'wastewater-management-plan-sop.pdf', false],
      ['Water Management Policy', 'water-management-policy.pdf'],
      ['Water Usage Policy', 'water-usage-policy.pdf']
    ]
  }
];

export const sustainabilityReport = [
  'Sustainability Report 2024–2025',
  'sustainability-report-2024-2025.pdf'
];

export const policyCount = policyGroups.reduce((n, g) => n + g.docs.length, 0);

/** Facility photography used across the site. */
export const facilityShots = [
  ['shopfloor-aisle', 'Production floor', false],
  ['moulding-machines', 'Injection moulding machines', false],
  ['moulding-line', 'Moulding line', false],
  ['operator-machine', 'Machine operation', false],
  ['operator-unload', 'Part unloading', false],
  ['material-drying', 'Material drying', true],
  ['mould-handling', 'Mould handling', false],
  ['mould-storage', 'Mould storage', false],
  ['tool-maintenance', 'Tool maintenance', false],
  ['quality-lab', 'Quality laboratory', false],
  ['quality-testing', 'Melt flow index testing', true],
  ['inspection-line', 'Inspection and sorting', false],
  ['assembly-line', 'Assembly', false],
  ['office-npd', 'Engineering office', false],
  ['facility-exterior', 'Plant exterior', false],
  ['facility-signage', 'Plant entrance', false],
  ['display-cabinet', 'Component display', false],
  ['shopfloor-wide', 'Shop floor overview', false]
];

/** Product photography — real parts, shot in-house. */
/**
 * Product photography. Captions describe what is visible in the frame only —
 * part names, customer and end application are NOT known and must not be
 * asserted here. GRG to confirm and replace with real designations.
 */
export const productShots = [
  ['product-frame', 'Moulded structural component', 'Injection moulded'],
  ['product-bracket', 'Multi-feature moulded bracket', 'Injection moulded'],
  ['product-bezel-gloss', 'Gloss-finished surround', 'Painted finish'],
  ['product-grille', 'Louvred grille moulding', 'Injection moulded'],
  ['product-vent', 'Ventilation louvre', 'Moulded and finished'],
  ['product-bracket-white', 'Painted mounting bracket', 'Painted finish']
];
