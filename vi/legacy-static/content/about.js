const { pageHead, ctaBand, compliance } = require('./_partials');

module.exports = {
  file: 'about.html',
  nav: 'About',
  title: 'About — GRG Polydynamics Private Limited',
  description:
    'GRG Polydynamics Private Limited is part of a professionally managed group with three decades of business endeavours and turnover above Rs.300 crores. The plastics division was established in 2011 at Sriperumbudur, Chennai.',
  body: `${pageHead({
    crumb: 'About',
    title: 'Group strength, applied to precision moulding',
    lead:
      'GRG Polydynamics Private Limited is part of a professionally managed group of companies with a global presence, three decades of business endeavours and a turnover above &#8377;300 crores.'
  })}

  <section class="section">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">The Company</p>
          <h2 class="h2">A plastics division built to serve global customers</h2>
          <p class="lead mt-16">
            GRG Polydynamics Private Limited is a plastics division started in the year 2011 to
            serve automotive and non-automotive customers.
          </p>
          <p class="lead mt-16">
            The company has grown and expanded its operations into precision and high-quality
            plastic injection moulding components for automotive, electrical and electronics,
            industrial and machine, and consumer product applications. The company engages
            product-specific experts to support global customers, meet their requirements and
            achieve customer delight.
          </p>
          <p class="lead mt-16">
            Operations are based at Vallakottai, Sriperumbudur &mdash; inside the Chennai automotive
            manufacturing belt, close to the OEM and tier-one supply base we serve.
          </p>
          <div class="btn-row">
            <a class="btn btn--primary" href="capabilities.html">Our Capabilities
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a class="btn btn--ghost" href="media.html">Facility &amp; Media</a>
          </div>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/about-plant.svg" alt="GRG Polydynamics plant infrastructure" loading="lazy" width="1200" height="900">
          <span class="split__badge">Plant Infrastructure</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--dark section--tight">
    <div class="wrap">
      <blockquote class="pull pull--dark" data-reveal>
        <p>&ldquo;We at GRG Polydynamics are committed to implement and practice world class
          manufacturing with continuous improvements with the engagement of all the workers. This
          is evident in our current businesses. Our goal is to establish a long-term relationship
          with our customer which will benefit both the ends.&rdquo;</p>
        <cite>Our commitment</cite>
      </blockquote>
    </div>
  </section>

  <section class="section section--paper">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">At a Glance</p>
        <h2 class="h2">The numbers behind the company</h2>
      </div>
      <div class="factgrid">
        <div class="fact" data-reveal>
          <span class="fact__val">3 decades</span>
          <span class="fact__label">Group business endeavours</span>
        </div>
        <div class="fact" data-reveal data-reveal-delay="60">
          <span class="fact__val">&#8377;300 Cr+</span>
          <span class="fact__label">Group turnover</span>
        </div>
        <div class="fact" data-reveal data-reveal-delay="120">
          <span class="fact__val">2011</span>
          <span class="fact__label">Plastics division established</span>
        </div>
        <div class="fact" data-reveal data-reveal-delay="180">
          <span class="fact__val">Global</span>
          <span class="fact__label">Customer presence</span>
        </div>
        <div class="fact" data-reveal data-reveal-delay="240">
          <span class="fact__val">4</span>
          <span class="fact__label">Industries served</span>
        </div>
        <div class="fact" data-reveal data-reveal-delay="300">
          <span class="fact__val">4</span>
          <span class="fact__label">System certifications</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">What We Stand For</p>
        <h2 class="h2">Commitments our certifications hold us to</h2>
        <p class="lead">Our IATF 16949, ISO 14001:2015, SQ Mark and ESG certifications are not
          decoration &mdash; each one carries an operating commitment.</p>
      </div>
      <div class="grid g-3">
        <article class="card" data-reveal>
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 17h18M6 17V8l6-4 6 4v9"/><path d="M10 17v-4h4v4"/></svg></div>
          <h3 class="h3">Automotive-Grade Standards</h3>
          <p>Manufacturing governed by IATF 16949 discipline &mdash; traceability, control plans and
            change management on every part number.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="70">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg></div>
          <h3 class="h3">Quality Management</h3>
          <p>A documented QMS covering inspection, dimensional verification, non-conformance
            handling and corrective action.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="140">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21c5-3 8-7 8-11a8 8 0 1 0-16 0c0 4 3 8 8 11z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg></div>
          <h3 class="h3">Environmental Responsibility</h3>
          <p>ISO 14001:2015 environmental management applied to material use, waste streams and
            plant operations.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="210">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 7 9 18l-5-5"/></svg></div>
          <h3 class="h3">Supplier Quality Excellence</h3>
          <p>SQ Mark recognition reflecting consistent conformance, delivery performance and
            responsiveness to customer audits.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="280">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v18"/><path d="M5 8c4 0 7-3 7-5 0 2 3 5 7 5"/><path d="M5 8v4a3.5 3.5 0 0 0 7 0"/><path d="M19 8v4a3.5 3.5 0 0 1-7 0"/></svg></div>
          <h3 class="h3">Sustainable Manufacturing</h3>
          <p>ESG-certified practices governing energy, water, waste and long-term operational
            responsibility.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="350">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="8" r="4"/></svg></div>
          <h3 class="h3">Ethical Employment</h3>
          <p>Published child labour, forced labour, POSH and wage equality policies, audited under
            our ESG commitments.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">How We Operate</p>
        <h2 class="h2">The operating model</h2>
      </div>
      <div class="grid g-2">
        <div data-reveal>
          <ul class="ticks">
            <li><strong>Requirement first.</strong> Nothing enters the plant before a customer
              requirement review and feasibility study is closed.</li>
            <li><strong>Design for manufacturability.</strong> Product design is evaluated for
              mouldability, tolerance capability and tooling implication before commitment.</li>
            <li><strong>Qualify the tool.</strong> Moulds are manufactured and qualified against a
              defined acceptance standard, not a trial-and-error loop.</li>
          </ul>
        </div>
        <div data-reveal data-reveal-delay="100">
          <ul class="ticks">
            <li><strong>Lock the process.</strong> Parameters are developed, optimised and captured
              in a control plan that production runs against.</li>
            <li><strong>Prove it dimensionally.</strong> Sample production is verified against
              drawing before PPAP submission.</li>
            <li><strong>Improve continuously.</strong> Post-launch performance feeds back into
              parameters, maintenance intervals and documentation.</li>
          </ul>
        </div>
      </div>

      <div class="mt-40">
        ${compliance(
          'We operate to lawful, ethical and sustainable employment practices across all operations and expect the same of our supply base.',
          { href: 'sustainability.html', label: 'Policy Library' }
        )}
      </div>
    </div>
  </section>
${ctaBand({
  title: 'Looking for a qualified manufacturing partner?',
  text: 'Send us your part drawings, annual volumes and target timeline.',
  primary: { href: 'contact.html', label: 'Contact Us' },
  secondary: { href: 'industries.html', label: 'Industries We Serve' }
})}
`
};
