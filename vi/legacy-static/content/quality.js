const { pageHead, ctaBand, compliance } = require('./_partials');

module.exports = {
  file: 'quality.html',
  nav: 'Quality',
  title: 'Quality &amp; Certifications — IATF 16949, ISO 14001:2015 | GRG Polydynamics',
  description:
    'IATF 16949, ISO 14001:2015, SQ Mark and ESG certifications — the quality, environmental and ethical commitments behind GRG Polydynamics manufacturing.',
  body: `${pageHead({
    crumb: 'Quality &amp; Certifications',
    title: 'Quality, environment and ethics &mdash; certified',
    lead:
      "Our certifications highlight GRG Polydynamics' commitment towards automotive-grade manufacturing standards, quality management systems, environmental responsibility, supplier quality excellence, and sustainable and ethical manufacturing practices."
  })}

  <section class="section">
    <div class="wrap">
      <div class="certs">
        <article class="cert" data-reveal>
          <img class="cert__seal" src="assets/img/seal-iatf.svg" alt="" loading="lazy" width="120" height="120">
          <h3>IATF 16949</h3>
          <p>The automotive sector quality management standard. It governs traceability, change
            control, control plans and corrective action across our production.</p>
          <span class="cert__meta">Automotive QMS</span>
        </article>
        <article class="cert" data-reveal data-reveal-delay="80">
          <img class="cert__seal" src="assets/img/seal-iso14001.svg" alt="" loading="lazy" width="120" height="120">
          <h3>ISO 14001:2015</h3>
          <p>Environmental management system covering identification and control of environmental
            aspects across materials, waste and plant operations.</p>
          <span class="cert__meta">Environment</span>
        </article>
        <article class="cert" data-reveal data-reveal-delay="160">
          <img class="cert__seal" src="assets/img/seal-sq.svg" alt="" loading="lazy" width="120" height="120">
          <h3>SQ Mark</h3>
          <p>Supplier quality recognition, confirming consistent conformance, delivery discipline
            and audit readiness as a supply partner.</p>
          <span class="cert__meta">Supplier Quality</span>
        </article>
        <article class="cert" data-reveal data-reveal-delay="240">
          <img class="cert__seal" src="assets/img/seal-esg.svg" alt="" loading="lazy" width="120" height="120">
          <h3>ESG Certificate</h3>
          <p>Environmental, social and governance certification covering sustainable and ethical
            manufacturing practice across the organisation.</p>
          <span class="cert__meta">Sustainability</span>
        </article>
      </div>

      <p class="muted mt-24 note">
        Certificate copies are available on request. Please
        <a href="contact.html">contact us</a> for current validity dates and scope statements.
      </p>
    </div>
  </section>

  <section class="section section--paper section--tight">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">What Certification Means Here</p>
        <h2 class="h2">Our commitments</h2>
      </div>
      <div class="table-wrap" data-reveal>
        <table>
          <caption class="sr-only">Certification commitments</caption>
          <thead>
            <tr><th scope="col">Commitment</th><th scope="col">Backed by</th><th scope="col">How it shows up in production</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Automotive-grade manufacturing standards</strong></td><td>IATF 16949</td><td>Control plans, traceability and disciplined change management on every part number</td></tr>
            <tr><td><strong>Quality management systems</strong></td><td>IATF 16949</td><td>Documented inspection, dimensional verification and corrective action</td></tr>
            <tr><td><strong>Environmental responsibility</strong></td><td>ISO 14001:2015</td><td>Controlled material use, waste segregation and monitored plant impact</td></tr>
            <tr><td><strong>Supplier quality excellence</strong></td><td>SQ Mark</td><td>Conformance and delivery performance measured and reviewed</td></tr>
            <tr><td><strong>Sustainable and ethical manufacturing</strong></td><td>ESG Certificate</td><td>Governed employment practice, resource use and long-term responsibility</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="wrap">
      ${compliance(
        'This is a standing declaration of our employment practice, published as a formal Child Labour Policy and enforced across all operations.',
        { href: 'sustainability.html', label: 'Read the Policy' }
      )}

      <div class="grid g-3 mt-40">
        <article class="card card--dark" data-reveal>
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 11H5v10h4zM14.5 3h-4v18h4zM20 8h-4v13h4z"/></svg></div>
          <h3 class="h3">In-Process Control</h3>
          <p>Parameters monitored against the released control plan throughout the production run.</p>
        </article>
        <article class="card card--dark" data-reveal data-reveal-delay="80">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></div>
          <h3 class="h3">Dimensional Verification</h3>
          <p>Sample and in-process inspection verified against drawing before release.</p>
        </article>
        <article class="card card--dark" data-reveal data-reveal-delay="160">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg></div>
          <h3 class="h3">Documentation Package</h3>
          <p>PPAP, APQP, FMEA and Control Plan maintained and available for customer audit.</p>
        </article>
      </div>
    </div>
  </section>
${ctaBand({
  title: 'Need our certificate copies for supplier onboarding?',
  text: 'Request the current certificate set and scope statements from our quality team.',
  primary: { href: 'contact.html', label: 'Request Certificates' },
  secondary: { href: 'sustainability.html', label: 'Policy Library' }
})}
`
};
