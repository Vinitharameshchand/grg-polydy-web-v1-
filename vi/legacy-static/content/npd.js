const { pageHead, ctaBand } = require('./_partials');

const STAGES = [
  [
    'Customer requirement review and feasibility study',
    'Drawings, volumes, application conditions and timing are reviewed against our process capability before any commitment is made.'
  ],
  [
    'Product design evaluation and DFM analysis',
    'Design for Manufacturability analysis identifies mouldability, draft, wall section, gating and tolerance risks while change is still inexpensive.'
  ],
  [
    'Tooling concept development and tool design approval',
    'Tool concept, cavitation and layout are developed and formally approved with the customer before cutting steel.'
  ],
  [
    'Mould manufacturing and qualification',
    'Moulds are manufactured and qualified against a defined acceptance standard covering fit, function and dimensional output.'
  ],
  [
    'Material selection and validation',
    'Grades are selected against application requirements and validated for processing behaviour and end-use performance.'
  ],
  [
    'Process parameter development and optimisation',
    'Parameters are systematically developed, optimised for cycle and quality, then captured for release to production.'
  ],
  [
    'Sample production and dimensional verification',
    'Samples are produced under released parameters and dimensionally verified against drawing before submission.'
  ],
  [
    'PPAP, APQP, FMEA, Control Plan and quality documentation',
    'The full documentation package is prepared and submitted &mdash; production part approval, advanced planning, failure mode analysis and the control plan production will run to.'
  ],
  [
    'Customer approval and production readiness review',
    'Approval is obtained and a readiness review confirms tooling, process, material, manpower and documentation are all in place.'
  ],
  [
    'Mass production launch and continuous improvement',
    'The line is launched and monitored, with performance data feeding back into parameters, maintenance intervals and documentation.'
  ]
];

const stageMarkup = STAGES.map(
  ([title, text], i) => `        <article class="process__item" data-reveal>
          <div class="process__num">${String(i + 1).padStart(2, '0')}</div>
          <div class="process__body">
            <h3 class="h3">${title}</h3>
            <p>${text}</p>
          </div>
        </article>`
).join('\n');

module.exports = {
  file: 'npd.html',
  nav: 'NPD',
  title: 'New Product Development — GRG Polydynamics',
  description:
    'A dedicated NPD team supporting complete product development and production readiness — feasibility, DFM, tooling, validation, PPAP and mass production launch.',
  body: `${pageHead({
    crumb: 'New Product Development',
    title: 'New Product Development',
    lead:
      'GRG Polydynamics has a dedicated NPD team supporting complete product development and production readiness activities &mdash; from the first feasibility review to a stabilised, launched production line.',
    tags: ['APQP', 'PPAP', 'FMEA', 'Control Plan', 'DFM']
  })}

  <section class="section">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">The Process</p>
        <h2 class="h2">Ten stages from requirement to mass production</h2>
        <p class="lead">Each stage has a defined input, a defined output and a gate that must be
          closed before the programme moves forward.</p>
      </div>

      <div class="process">
${stageMarkup}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="wrap">
      <div class="split">
        <div class="split__media" data-reveal>
          <img src="assets/img/npd-team.svg" alt="NPD team activity" loading="lazy" width="1200" height="900">
          <span class="split__badge">NPD Team</span>
        </div>
        <div data-reveal data-reveal-delay="120">
          <p class="eyebrow">Deliverables</p>
          <h2 class="h2">What you receive at each gate</h2>
          <p class="lead mt-16">Every NPD programme produces a documented, auditable trail &mdash;
            the same package our IATF 16949 system requires internally.</p>
          <ul class="ticks mt-24">
            <li>Feasibility and DFM report</li>
            <li>Approved tool design and qualification record</li>
            <li>Material validation record</li>
            <li>Released process parameter sheet</li>
            <li>Dimensional verification report</li>
            <li>PPAP submission with FMEA and Control Plan</li>
            <li>Production readiness review sign-off</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper section--tight">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">Working With Us</p>
        <h2 class="h2">What we need to start</h2>
      </div>
      <div class="grid g-4">
        <article class="card" data-reveal>
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg></div>
          <h3 class="h3">Part Drawing</h3>
          <p>2D drawing or 3D model with tolerances and critical characteristics identified.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="80">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20h16"/><path d="M6 16V9M12 16V5M18 16v-4"/></svg></div>
          <h3 class="h3">Annual Volume</h3>
          <p>Expected annual quantity and any known ramp profile, so cavitation can be sized.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="160">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg></div>
          <h3 class="h3">Target Timeline</h3>
          <p>Required SOP date, so tooling lead time and validation can be planned backwards.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="240">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v18"/><path d="M5 8c4 0 7-3 7-5 0 2 3 5 7 5"/></svg></div>
          <h3 class="h3">Application Context</h3>
          <p>Operating environment, material preference and any regulatory requirement.</p>
        </article>
      </div>
    </div>
  </section>
${ctaBand({
  title: 'Have a new part to develop?',
  text: 'Send the drawing and target volumes &mdash; we will come back with a feasibility view and an indicative development timeline.',
  primary: { href: 'contact.html', label: 'Start an Enquiry' },
  secondary: { href: 'capabilities.html', label: 'View Capabilities' }
})}
`
};
