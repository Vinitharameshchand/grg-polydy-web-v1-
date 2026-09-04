const { pageHead, ctaBand, compliance } = require('./_partials');

/**
 * Policy documents currently hosted on the live grgpolydynamics.com site.
 * After migration, copy the PDFs into assets/docs/ and set DOC_BASE to ''
 * so the links resolve locally.
 *
 * A third entry of `false` marks a policy whose PDF is NOT currently uploaded
 * (it 404s on the live server today). Those render as "on request" instead of
 * a dead link — upload the file, drop the `false`, and rebuild.
 * Run `node assets/js/check-docs.js` to re-verify every link.
 */
const DOC_BASE = 'https://grgpolydynamics.com/';

const GROUPS = [
  {
    id: 'labour',
    title: 'Labour &amp; Human Rights',
    note: 'How people are hired, paid, protected and heard.',
    icon: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="8" r="4"/>',
    docs: [
      ['Child Labour Policy', 'Policy/3.1.1.Child Labour Policy.pdf'],
      ['Forced Labour Policy', 'Policy/3.1.3.Forced Labour Policy.pdf'],
      ['Anti-Harassment Policy', 'Policy/3.1.5.Anti-Harassment Policy.pdf'],
      ['POSH Policy', 'Policy/3.1.6.POSH Policy.pdf'],
      ['Ethical Hiring Policy', 'Policy/3.1.13.Ethical Hiring Policy.pdf'],
      ['Recruitment Policy', 'Policy/3.6.1.Recruitment Policy.pdf'],
      ['Company HR Policy', 'Policy/3.2.1.Company HR Policy.pdf'],
      ['Grievance Handling Policy', 'Policy/3.4.1.Grievance Handling Policy.pdf'],
      ['Wage Policy', 'Policy/Wage_Policy_GRG_Polydynamic.pdf'],
      ['Wage Equality Policy', 'Policy/3.7.4.wage Equality Policy.pdf'],
      ['Employee Privacy Policy', 'Policy/3.9.4 Employee Privacy Policy.pdf'],
      ['Parental Leave Policy', 'Policy/3.14.3.Parental Leave Policy.pdf'],
      ['Maternity Policy', 'Policy/GRG_Maternity_Policy.pdf'],
      ['Remote Working Policy', 'Policy/GRG_Remote_Working_Policy.pdf']
    ]
  },
  {
    id: 'safety',
    title: 'Health &amp; Safety',
    note: 'Occupational safety on the shop floor and across the site.',
    icon: '<path d="M12 2 4 6v6c0 5 3.4 9 8 10 4.6-1 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/>',
    docs: [
      ['Health and Safety Policy', 'Policy/GRG_Health_and_Safety_Policy.pdf'],
      ['Occupational Health and Safety Policy', 'Policy/Occupational Health and Safety Policy.pdf', false]
    ]
  },
  {
    id: 'governance',
    title: 'Governance &amp; Ethics',
    note: 'How we conduct business and handle disclosure.',
    icon: '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M10 21v-6h4v6"/>',
    docs: [
      ['Ethics Policy', 'Policy/GRG_Ethics_Policy.pdf'],
      ['Gift and Hospitality Policy', 'Policy/GRG_Gift_and_Hospitality_Policy.pdf'],
      ['Whistleblower Policy', 'Policy/GRG_Whistleblower_Policy.pdf']
    ]
  },
  {
    id: 'environment',
    title: 'Environment, Energy &amp; Waste',
    note: 'The ISO 14001:2015 management system, documented.',
    icon: '<path d="M12 21c5-3 8-7 8-11a8 8 0 1 0-16 0c0 4 3 8 8 11z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>',
    docs: [
      ['Environment Policy', 'EVS/Environment Policy.pdf'],
      ['Environmental Roles and Responsibilities', 'EVS/Environmental Roles and Responsibilities.pdf'],
      ['Biodiversity Policy', 'EVS/Biodiversity Policy.pdf'],
      ['Energy Policy', 'EVS/Energy Policy.pdf'],
      ['Energy Usage Policy', 'EVS/Energy_Usage_Policy_GRG_Polydynamic.pdf'],
      ['GHG Reduction Goal Policy', 'EVS/GHG Reduction Goal Policy.pdf'],
      ['Waste Management Policy', 'EVS/Waste Management Policy.pdf'],
      ['Internal SOPs for Waste Handling', 'EVS/Interenal SOPs for Waste handling.pdf'],
      ['Hazardous Waste Storage &amp; Handling SOP', 'EVS/SOP_Hazardous_Waste_Storage_Handling_GRG_Polydynamic (1).pdf'],
      ['Wastewater Management Plan &ndash; SOP', 'EVS/Wastewater Management Plan – SOP.pdf', false],
      ['Water Management Policy', 'EVS/Water Management Policy.pdf'],
      ['Water Usage Policy', 'EVS/Water Usage Policy.pdf']
    ]
  }
];

const REPORT = ['Sustainability Report 2024&ndash;2025', 'Reports/SUSTAINABILITY-REPORT-2024–2025.pdf'];

const docCount = GROUPS.reduce((n, g) => n + g.docs.length, 0);

const pdfIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>';

const link = ([label, file, uploaded]) =>
  uploaded === false
    ? `          <li><span class="policy-list__pending">${pdfIcon}<span>${label}</span><em>On request</em></span></li>`
    : `          <li><a href="${DOC_BASE + encodeURI(file).replace(/&/g, '&amp;')}" target="_blank" rel="noopener">${pdfIcon}<span>${label}</span><em>PDF</em></a></li>`;

const groupMarkup = GROUPS.map(
  (g, i) => `      <section class="policy-group" id="${g.id}" data-reveal${i ? ` data-reveal-delay="${i * 60}"` : ''}>
        <header class="policy-group__head">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${g.icon}</svg></div>
          <div>
            <h3 class="h3">${g.title}</h3>
            <p class="muted">${g.note}</p>
          </div>
          <span class="policy-group__count">${g.docs.length} documents</span>
        </header>
        <ul class="policy-list">
${g.docs.map(link).join('\n')}
        </ul>
      </section>`
).join('\n\n');

module.exports = {
  file: 'sustainability.html',
  nav: 'Sustainability',
  title: 'Sustainability, Governance &amp; Policies — GRG Polydynamics',
  description:
    'Published policies covering labour and human rights, health and safety, governance and ethics, and environmental management — plus the GRG Polydynamics Sustainability Report 2024-2025.',
  body: `${pageHead({
    crumb: 'Sustainability &amp; Policies',
    title: 'Sustainability, governance and published policy',
    lead:
      'Our ESG commitments are written down and published. Every policy below is a live document governing how the plant operates &mdash; available to customers, auditors and our own people.',
    tags: [`${docCount}+ Published Policies`, 'ISO 14001:2015', 'ESG Certified']
  })}

  <!-- ===== REPORT ===== -->
  <section class="section section--tight">
    <div class="wrap">
      <a class="report-card" href="${DOC_BASE + encodeURI(REPORT[1])}" target="_blank" rel="noopener" data-reveal>
        <div class="report-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>
        </div>
        <div class="report-card__body">
          <p class="eyebrow">Latest Report</p>
          <h2 class="h3">${REPORT[0]}</h2>
          <p class="muted">Our annual account of environmental, social and governance performance
            &mdash; energy, water, waste, emissions and workplace practice.</p>
        </div>
        <span class="btn btn--primary">Download PDF
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 4v12M7 12l5 5 5-5M5 20h14"/></svg>
        </span>
      </a>
    </div>
  </section>

  <!-- ===== PILLARS ===== -->
  <section class="section section--paper">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">Our Approach</p>
        <h2 class="h2">Four pillars, documented and audited</h2>
        <p class="lead">ESG certification and ISO 14001:2015 require evidence, not intent. These
          are the areas we measure and publish against.</p>
      </div>
      <div class="grid g-4">
        <article class="card" data-reveal>
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21c5-3 8-7 8-11a8 8 0 1 0-16 0c0 4 3 8 8 11z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg></div>
          <h3 class="h3">Environment</h3>
          <p>Environment, biodiversity, waste and wastewater policies under an ISO 14001:2015
            management system.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="80">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg></div>
          <h3 class="h3">Energy &amp; Emissions</h3>
          <p>Energy and energy-usage policies with a published GHG reduction goal.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="160">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/></svg></div>
          <h3 class="h3">Water</h3>
          <p>Water management and usage policies, with a documented wastewater management SOP.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="240">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="8" r="4"/></svg></div>
          <h3 class="h3">People &amp; Governance</h3>
          <p>Child labour, forced labour, POSH, wage equality, ethics and whistleblower policies.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== POLICY LIBRARY ===== -->
  <section class="section">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">Policy Library</p>
        <h2 class="h2">${docCount} published policies</h2>
        <p class="lead">Grouped by area. Each opens the current signed document as a PDF.</p>
      </div>

${groupMarkup}
    </div>
  </section>

  <section class="section section--dark section--tight">
    <div class="wrap">
      ${compliance(
        'Published as a formal Child Labour Policy alongside our Forced Labour, Ethical Hiring and Wage Equality policies, and audited under our ESG commitments.',
        { href: DOC_BASE + encodeURI('Policy/3.1.1.Child Labour Policy.pdf'), label: 'Read the Policy' }
      )}
    </div>
  </section>
${ctaBand({
  title: 'Running a supplier ESG or compliance assessment?',
  text: 'We can supply signed policy copies, certificate scopes and our latest sustainability report directly.',
  primary: { href: 'contact.html', label: 'Contact Our Team' },
  secondary: { href: 'quality.html', label: 'Certifications' }
})}
`
};
