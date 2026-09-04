const { pageHead, ctaBand } = require('./_partials');

module.exports = {
  file: 'capabilities.html',
  nav: 'Capabilities',
  title: 'Capabilities — Injection Moulding, Mould Making &amp; Finishing | GRG Polydynamics',
  description:
    'Product development, prototyping, mould making, precision plastic injection moulding, painting and chrome plating, screen and pad printing, metal casting and tooling transfer support.',
  body: `${pageHead({
    crumb: 'Capabilities',
    title: 'Capabilities across the full part lifecycle',
    lead:
      'Development, tooling, moulding and finishing under one roof &mdash; plus metal casting and structured tooling transfer support for programmes moving in from elsewhere.',
    tags: ['Product Development', 'Prototyping', 'Mould Making', 'Moulding', 'Finishing', 'Tooling Transfer']
  })}

  <!-- ===== OVERVIEW ===== -->
  <section class="section section--tight">
    <div class="wrap">
      <div class="offer-grid">
        <a class="offer offer--link" href="#product-development" data-reveal>
          <span class="offer__idx">01</span>
          <h3 class="h3">Product Development</h3>
          <p>Requirement review, feasibility and design evaluation.</p>
        </a>
        <a class="offer offer--link" href="#prototyping" data-reveal data-reveal-delay="50">
          <span class="offer__idx">02</span>
          <h3 class="h3">Prototyping</h3>
          <p>Form, fit and function validated before production tooling.</p>
        </a>
        <a class="offer offer--link" href="#mould-making" data-reveal data-reveal-delay="100">
          <span class="offer__idx">03</span>
          <h3 class="h3">Mould Making</h3>
          <p>Tool design, manufacture and qualification in-house.</p>
        </a>
        <a class="offer offer--link" href="#injection-moulding" data-reveal data-reveal-delay="150">
          <span class="offer__idx">04</span>
          <h3 class="h3">Plastic Part Production</h3>
          <p>High-volume precision injection moulding.</p>
        </a>
        <a class="offer offer--link" href="#finishing" data-reveal data-reveal-delay="200">
          <span class="offer__idx">05</span>
          <h3 class="h3">Painting &amp; Chrome Plating</h3>
          <p>Decorative and functional surface finishing.</p>
        </a>
        <a class="offer offer--link" href="#finishing" data-reveal data-reveal-delay="250">
          <span class="offer__idx">06</span>
          <h3 class="h3">Screen &amp; Pad Printing</h3>
          <p>Graphics, legends and markings on finished parts.</p>
        </a>
      </div>
    </div>
  </section>

  <!-- ===== PRODUCT DEVELOPMENT + PROTOTYPING ===== -->
  <section class="section section--paper" id="product-development">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">Capability 01 &amp; 02</p>
          <h2 class="h2">Product Development &amp; Prototyping</h2>
          <p class="lead mt-16">
            Programmes start with a requirement review, not a quotation. We evaluate the design
            against our process capability, flag manufacturability risk while change is still
            inexpensive, and prove the concept physically before production tooling is committed.
          </p>
          <ul class="ticks mt-24">
            <li>Customer requirement review and feasibility study</li>
            <li>Design for Manufacturability (DFM) analysis</li>
            <li>Material selection and validation</li>
            <li id="prototyping">Prototype samples for form, fit and function</li>
            <li>Dimensional verification against drawing</li>
          </ul>
          <a class="arrow-link mt-16" href="npd.html">See the full NPD process
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/npd-team.svg" alt="Product development and prototyping" loading="lazy" width="1200" height="900">
          <span class="split__badge">Development</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== MOULD MAKING ===== -->
  <section class="section" id="mould-making">
    <div class="wrap">
      <div class="split split--rev">
        <div data-reveal>
          <p class="eyebrow">Capability 03</p>
          <h2 class="h2">Mould Making</h2>
          <p class="lead mt-16">
            Tool concept, cavitation and layout are developed and formally approved with the
            customer before steel is cut. Moulds are then manufactured and qualified against a
            defined acceptance standard covering fit, function and dimensional output.
          </p>
          <ul class="ticks mt-24">
            <li>Tooling concept development</li>
            <li>Tool design and customer approval</li>
            <li>Mould manufacturing and qualification</li>
            <li>Trial validation and optimisation</li>
            <li>Preventive maintenance scheduling</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/tool-room.svg" alt="Tool room and mould making" loading="lazy" width="1200" height="750">
          <span class="split__badge">Tool Room</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== INJECTION MOULDING ===== -->
  <section class="section section--paper" id="injection-moulding">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">Capability 04</p>
          <h2 class="h2">Plastic Injection Moulding</h2>
          <p class="lead mt-16">
            Precision injection moulded components for automotive, electrical and electronics,
            industrial machine and consumer product applications &mdash; produced at volume under
            controlled and continuously monitored process parameters.
          </p>
          <ul class="ticks mt-24">
            <li>Precision injection moulded components</li>
            <li>Automotive and industrial applications</li>
            <li>High-volume manufacturing</li>
            <li>Process optimisation and quality control</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/cap-injection-molding.svg" alt="Plastic injection moulding machines" loading="lazy" width="1200" height="750">
          <span class="split__badge">Injection Moulding</span>
        </div>
      </div>

      <div class="table-wrap mt-40" data-reveal>
        <table>
          <caption class="sr-only">Injection moulding process controls</caption>
          <thead>
            <tr><th scope="col">Stage</th><th scope="col">Control Applied</th><th scope="col">Output</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Material</strong></td><td>Material selection and validation against application requirement</td><td>Approved material specification</td></tr>
            <tr><td><strong>Tooling</strong></td><td>Mould qualification and preventive maintenance schedule</td><td>Qualified, maintained tool</td></tr>
            <tr><td><strong>Process</strong></td><td>Parameter development, optimisation and lock-down</td><td>Released process sheet</td></tr>
            <tr><td><strong>Production</strong></td><td>Control plan monitoring and in-process inspection</td><td>Conforming components at volume</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===== FINISHING ===== -->
  <section class="section" id="finishing">
    <div class="wrap">
      <div class="split split--rev">
        <div data-reveal>
          <p class="eyebrow">Capability 05 &amp; 06</p>
          <h2 class="h2">Painting, Chrome Plating &amp; Printing</h2>
          <p class="lead mt-16">
            Appearance-critical parts are finished in-house. Keeping decoration on the same site as
            moulding shortens the loop between a surface defect and the process parameter that
            caused it &mdash; and removes a transport stage from the programme.
          </p>
          <ul class="ticks mt-24">
            <li>Painting for decorative and functional finishes</li>
            <li>Chrome plating on moulded components</li>
            <li>Screen printing</li>
            <li>Pad printing for graphics, legends and markings</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/product-closeup.svg" alt="Finished and decorated mouldings" loading="lazy" width="1200" height="750">
          <span class="split__badge">Finishing</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== METAL CASTING ===== -->
  <section class="section section--paper" id="metal-casting">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">Capability 07</p>
          <h2 class="h2">Metal Casting</h2>
          <p class="lead mt-16">
            Industrial metal casting solutions for engineering-grade components, with custom
            manufacturing support from concept through repeatable precision production.
          </p>
          <ul class="ticks mt-24">
            <li>Industrial metal casting solutions</li>
            <li>Engineering-grade components</li>
            <li>Custom manufacturing support</li>
            <li>Precision production capability</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/cap-metal-casting.svg" alt="Metal casting process" loading="lazy" width="1200" height="750">
          <span class="split__badge">Metal Casting</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== TOOLING TRANSFER ===== -->
  <section class="section" id="tooling-transfer">
    <div class="wrap">
      <div class="split split--rev">
        <div data-reveal>
          <p class="eyebrow">Capability 08</p>
          <h2 class="h2">Tooling Transfer Support</h2>
          <p class="lead mt-16">
            Moving a tool between suppliers or plants is a controlled engineering exercise, not a
            logistics one. We take responsibility for the transfer, the assessment and the
            stabilisation of the process that follows.
          </p>
          <ul class="ticks mt-24">
            <li>Mould transfer and validation</li>
            <li>Preventive maintenance (PM)</li>
            <li>PREP assessment and process stabilisation</li>
            <li>Production transition support</li>
            <li>Trial validation and optimisation</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/cap-tooling-transfer.svg" alt="Tooling transfer support" loading="lazy" width="1200" height="750">
          <span class="split__badge">Transfer Programme</span>
        </div>
      </div>

      <div class="grid g-4 mt-40">
        <article class="card" data-reveal>
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 7h13v10H3z"/><path d="M16 10h5v7h-5"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg></div>
          <h3 class="h3">Transfer</h3>
          <p>Tool receipt, condition survey and validation against the incoming specification.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="80">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z"/></svg></div>
          <h3 class="h3">PREP Assessment</h3>
          <p>Structured assessment of tool readiness, wear items and required refurbishment.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="160">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 18 9 12l3.5 3.5L21 7"/><path d="M15 7h6v6"/></svg></div>
          <h3 class="h3">Stabilisation</h3>
          <p>Trial validation and parameter optimisation until output is repeatable and capable.</p>
        </article>
        <article class="card" data-reveal data-reveal-delay="240">
          <div class="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg></div>
          <h3 class="h3">Preventive Maintenance</h3>
          <p>Scheduled PM intervals to protect cycle time, tool life and dimensional stability.</p>
        </article>
      </div>
    </div>
  </section>
${ctaBand({
  title: 'Tell us what you need manufactured.',
  text: 'Drawings, volumes and application context are enough for us to start a feasibility view.',
  primary: { href: 'contact.html', label: 'Request a Quote' },
  secondary: { href: 'npd.html', label: 'NPD Process' }
})}
`
};
