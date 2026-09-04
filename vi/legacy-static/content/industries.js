const { pageHead, ctaBand } = require('./_partials');

module.exports = {
  file: 'industries.html',
  nav: 'Industries',
  title: 'Industries Served — Automotive, Electrical, Machine &amp; Consumer | GRG Polydynamics',
  description:
    'GRG Polydynamics serves automotive, electrical and electronics, industrial machine and consumer product customers with precision plastic injection moulded components.',
  body: `${pageHead({
    crumb: 'Industries',
    title: 'Our domain expertise',
    lead:
      'Four sectors, each with its own acceptance criteria &mdash; served by one quality system and one set of documented process controls.',
    tags: ['Automotive', 'Electrical &amp; Electronics', 'Industrial &amp; Machine', 'Consumer Products']
  })}

  <!-- ===== AUTOMOTIVE ===== -->
  <section class="section" id="automotive">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">Sector 01</p>
          <h2 class="h2">Automotive</h2>
          <p class="lead mt-16">
            The plastics division was established in 2011 to serve automotive customers, and
            automotive discipline still sets the standard for everything else we run. Our
            IATF 16949 certification governs traceability, control plans and change management on
            every automotive part number.
          </p>
          <ul class="ticks mt-24">
            <li>Precision moulded components for automotive assemblies</li>
            <li>PPAP and APQP documentation as standard deliverables</li>
            <li>Control-plan driven production with in-process inspection</li>
            <li>Located inside the Sriperumbudur automotive belt, near the OEM supply base</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/ind-automotive.svg" alt="Automotive moulded components" loading="lazy" width="1200" height="750">
          <span class="split__badge">IATF 16949</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ELECTRICAL ===== -->
  <section class="section section--paper" id="electrical">
    <div class="wrap">
      <div class="split split--rev">
        <div data-reveal>
          <p class="eyebrow">Sector 02</p>
          <h2 class="h2">Electrical &amp; Electronics</h2>
          <p class="lead mt-16">
            Electrical and electronics components carry safety and insulation requirements that
            make material selection and process consistency inseparable from the part itself. Both
            are validated before a tool is released to production.
          </p>
          <ul class="ticks mt-24">
            <li>Insulating housings, enclosures and switchgear parts</li>
            <li>Engineering-grade polymer selection and validation</li>
            <li>Dimensional stability for assembly and contact fit</li>
            <li>Traceable material and process records</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/ind-electrical.svg" alt="Electrical and electronics components" loading="lazy" width="1200" height="750">
          <span class="split__badge">Engineering Polymers</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== MACHINE ===== -->
  <section class="section" id="machine">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">Sector 03</p>
          <h2 class="h2">Industrial &amp; Machine Components</h2>
          <p class="lead mt-16">
            Functional machine components are judged on whether they assemble and keep working.
            Repeatability across a production run &mdash; not a single good sample &mdash; is what
            our process lock-down and preventive maintenance schedule exist to protect.
          </p>
          <ul class="ticks mt-24">
            <li>Functional components for industrial machinery</li>
            <li>Tight dimensional tolerance and stability</li>
            <li>Custom manufacturing support, including metal casting</li>
            <li>Low- and high-volume programmes</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/ind-machine.svg" alt="Industrial machine components" loading="lazy" width="1200" height="750">
          <span class="split__badge">Precision Production</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CONSUMER ===== -->
  <section class="section section--paper" id="consumer">
    <div class="wrap">
      <div class="split split--rev">
        <div data-reveal>
          <p class="eyebrow">Sector 04</p>
          <h2 class="h2">Consumer Products</h2>
          <p class="lead mt-16">
            Consumer parts are appearance-critical, and appearance defects are process defects. Our
            in-house painting, chrome plating and pad printing keep decoration on the same site as
            moulding, so a surface issue is traced back to its cause without shipping parts
            anywhere.
          </p>
          <ul class="ticks mt-24">
            <li>Appearance-critical moulded components</li>
            <li>In-house painting and chrome plating</li>
            <li>Screen and pad printing for graphics and legends</li>
            <li>Cosmetic inspection against agreed acceptance standards</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/ind-consumer.svg" alt="Consumer product components" loading="lazy" width="1200" height="750">
          <span class="split__badge">Finished In-House</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== COMMON ===== -->
  <section class="section section--dark">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">Common To Every Sector</p>
        <h2 class="h2">What does not change between industries</h2>
      </div>
      <div class="grid g-3">
        <article class="card card--dark" data-reveal>
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg></div>
          <h3 class="h3">Documented Process</h3>
          <p>Every part number runs against a released process sheet and control plan.</p>
        </article>
        <article class="card card--dark" data-reveal data-reveal-delay="80">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></div>
          <h3 class="h3">Dimensional Verification</h3>
          <p>Samples and in-process checks verified against drawing before release.</p>
        </article>
        <article class="card card--dark" data-reveal data-reveal-delay="160">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 2 4 6v6c0 5 3.4 9 8 10 4.6-1 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg></div>
          <h3 class="h3">Certified Systems</h3>
          <p>IATF 16949, ISO 14001:2015, SQ Mark and ESG apply to the whole plant.</p>
        </article>
      </div>
    </div>
  </section>
${ctaBand({
  title: 'Does your part fit one of these sectors?',
  text: 'Send the drawing and annual volume &mdash; we will confirm feasibility against our process capability.',
  primary: { href: 'contact.html', label: 'Start an Enquiry' },
  secondary: { href: 'capabilities.html', label: 'View Capabilities' }
})}
`
};
