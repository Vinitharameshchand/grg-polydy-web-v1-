const { pageHead } = require('./_partials');

module.exports = (C) => ({
  file: 'contact.html',
  nav: 'Contact',
  title: 'Contact — GRG Polydynamics Private Limited, Sriperumbudur, Chennai',
  description:
    'Contact GRG Polydynamics Private Limited, Vallakottai, Sriperumbudur, Chennai 631604 — for injection moulding, mould making, metal casting, tooling transfer and NPD enquiries.',
  body: `${pageHead({
    crumb: 'Contact',
    title: 'Start an enquiry',
    lead:
      'Share your drawings, volumes and timeline. Our team will respond with a feasibility view and an indicative development plan.'
  })}

  <section class="section">
    <div class="wrap contact-grid">

      <div data-reveal>
        <p class="eyebrow">Reach Us</p>
        <h2 class="h2">${C.legalName}</h2>
        <p class="lead mt-16">Enquiries for injection moulding, mould making, metal casting,
          tooling transfer and new product development are handled directly by our engineering
          team.</p>

        <div class="mt-24">
          <div class="info-item">
            <div class="info-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>
            </div>
            <div>
              <h4>Plant &amp; Registered Office</h4>
              <address>
                ${C.street},<br>
                ${C.locality},<br>
                ${C.city} &ndash; ${C.postalCode}, ${C.region}, ${C.country}
              </address>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4.5 3.5h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15.5 13.5l5 2v4a1.5 1.5 0 0 1-1.7 1.5A17 17 0 0 1 3 5.2 1.5 1.5 0 0 1 4.5 3.5z"/></svg>
            </div>
            <div>
              <h4>Phone</h4>
              <p><a href="tel:${C.phonePrimaryHref}">${C.phonePrimary}</a></p>
              <p><a href="tel:${C.phoneSecondaryHref}">${C.phoneSecondary}</a></p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/></svg>
            </div>
            <div>
              <h4>Email</h4>
              <p><a href="mailto:${C.email}">${C.email}</a></p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item__icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.96 1.36-.5.05-.98.23-3.3-.69-2.77-1.09-4.53-3.92-4.67-4.1-.13-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.28c.25-.27.54-.34.72-.34l.52.01c.17.01.39-.06.61.47.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.09.18-.14.29-.28.45l-.42.49c-.14.14-.28.29-.12.57.16.27.72 1.18 1.54 1.92 1.06.94 1.95 1.23 2.22 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.61-.13.25.09 1.6.75 1.87.89.27.14.46.2.53.32.07.11.07.65-.17 1.33z"/></svg>
            </div>
            <div>
              <h4>WhatsApp</h4>
              <p><a href="${C.whatsapp}" target="_blank" rel="noopener">${C.phoneSecondary}</a></p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
            </div>
            <div>
              <h4>Response Time</h4>
              <p>Our customer support team responds within 48 business hours.</p>
            </div>
          </div>
        </div>
      </div>

      <div data-reveal data-reveal-delay="120">
        <form class="form" id="enquiry-form" novalidate>
          <h3 class="h3" style="margin-bottom:20px">Enquiry form</h3>

          <div class="field--row">
            <div class="field">
              <label for="name">Full Name</label>
              <input id="name" name="name" type="text" required autocomplete="name" placeholder="Your name">
            </div>
            <div class="field">
              <label for="company">Company</label>
              <input id="company" name="company" type="text" autocomplete="organization" placeholder="Company name">
            </div>
          </div>

          <div class="field--row">
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required autocomplete="email" placeholder="name@company.com">
            </div>
            <div class="field">
              <label for="phone">Phone</label>
              <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="+91 00000 00000">
            </div>
          </div>

          <div class="field--row">
            <div class="field">
              <label for="interest">Enquiry Type</label>
              <select id="interest" name="interest" required>
                <option value="">Select an area</option>
                <option>Plastic Injection Moulding</option>
                <option>Mould Making / Tooling</option>
                <option>Painting, Plating &amp; Printing</option>
                <option>Metal Casting</option>
                <option>Tooling Transfer Support</option>
                <option>New Product Development</option>
                <option>Certificates / Supplier Onboarding</option>
                <option>Other</option>
              </select>
            </div>
            <div class="field">
              <label for="industry">Industry</label>
              <select id="industry" name="industry">
                <option value="">Select an industry</option>
                <option>Automotive</option>
                <option>Electrical &amp; Electronics</option>
                <option>Industrial &amp; Machine</option>
                <option>Consumer Products</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label for="message">Requirement Details</label>
            <textarea id="message" name="message" required placeholder="Component description, annual volume, material, target timeline, and any drawings you can share."></textarea>
          </div>

          <button class="btn btn--primary" type="submit" style="width:100%">
            Send Enquiry
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>

          <p class="form__note">Drawings and specifications can be emailed directly to
            <a href="mailto:${C.email}">${C.email}</a>. All enquiries are treated as confidential.</p>
          <p class="form__status" role="status" aria-live="polite"></p>
        </form>
      </div>

    </div>
  </section>

  <section class="section section--paper section--tight">
    <div class="wrap">
      <div class="section-head center" data-reveal>
        <p class="eyebrow">Location</p>
        <h2 class="h2">Vallakottai, Sriperumbudur</h2>
        <p class="lead">Inside the Chennai automotive manufacturing belt, close to the OEM and
          tier-one supply base we serve.</p>
      </div>
      <div class="map-frame" data-reveal>
        <iframe
          title="Map showing GRG Polydynamics, Vallakottai, Sriperumbudur"
          src="https://www.google.com/maps?q=Vallakottai%2C%20Sriperumbudur%2C%20Chennai%20631604&output=embed"
          loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
    </div>
  </section>
`
});
