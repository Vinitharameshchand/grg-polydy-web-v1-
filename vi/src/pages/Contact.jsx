import { useState } from 'react';
import { Arrow, PageHead, Reveal, Section } from '../components/ui';
import { company } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';

const INTERESTS = [
  'Plastic injection moulding',
  'Mould making / tooling',
  'Painting, plating & printing',
  'Metal casting',
  'Tooling transfer support',
  'New product development',
  'Certificates / supplier onboarding',
  'Other'
];

const INDUSTRIES = ['Automotive', 'Electrical & electronics', 'Industrial & machine', 'Consumer products', 'Other'];

export default function Contact() {
  usePageMeta(
    'Contact — GRG Polydynamics Private Limited',
    'Contact GRG Polydynamics at Vallakottai, Sriperumbudur, Chennai 631604 for injection moulding, mould making, metal casting, tooling transfer and NPD enquiries.'
  );

  const [status, setStatus] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const first = String(data.get('name') || '').split(' ')[0];
    setStatus(
      `Thank you${first ? ', ' + first : ''}. Your enquiry has been recorded. Our team will respond within 48 business hours.`
    );
    form.reset();
    /* Wire to a real endpoint here, e.g.
       fetch('/api/enquiry', { method: 'POST', body: data }) */
  }

  return (
    <>
      <PageHead
        crumb="Contact"
        title="Start an enquiry."
        lead="Share your drawings, volumes and timeline. Our team will respond with a feasibility view and an indicative development plan."
      />

      <Section>
        <div className="contact-grid">
          <Reveal>
            <span className="label">Reach us</span>
            <h2 className="h2" style={{ marginTop: 16, marginBottom: 28 }}>
              {company.legalName}
            </h2>

            <dl className="info">
              <div className="info__item">
                <dt>Plant & office</dt>
                <dd>
                  <address>
                    {company.street},
                    <br />
                    {company.locality},
                    <br />
                    {company.city} – {company.postalCode}, {company.region}, {company.country}
                  </address>
                </dd>
              </div>
              <div className="info__item">
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
                  <br />
                  <a href={`tel:${company.phoneAltHref}`}>{company.phoneAlt}</a>
                </dd>
              </div>
              <div className="info__item">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </dd>
              </div>
              <div className="info__item">
                <dt>WhatsApp</dt>
                <dd>
                  <a href={company.whatsapp} target="_blank" rel="noopener noreferrer">
                    {company.phoneAlt}
                  </a>
                </dd>
              </div>
              <div className="info__item">
                <dt>Response</dt>
                <dd>Within 48 business hours.</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={100}>
            <form className="form" id="enquiry-form" noValidate onSubmit={onSubmit}>
              <h2 className="h3" style={{ marginBottom: 26 }}>
                Enquiry form
              </h2>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" autoComplete="organization" placeholder="Company name" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="name@company.com" />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="interest">Enquiry type</label>
                  <select id="interest" name="interest" required defaultValue="">
                    <option value="" disabled>
                      Select an area
                    </option>
                    {INTERESTS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="industry">Industry</label>
                  <select id="industry" name="industry" defaultValue="">
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Requirement details</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Component description, annual volume, material, target timeline, and any drawings you can share."
                />
              </div>

              <button className="btn btn--solid" type="submit" style={{ width: '100%' }}>
                Send enquiry
                <Arrow />
              </button>

              <p className="form__note">
                Drawings and specifications can be emailed directly to{' '}
                <a href={`mailto:${company.email}`}>{company.email}</a>. All enquiries are treated
                as confidential.
              </p>

              {status && (
                <p className="form__status" role="status" aria-live="polite">
                  {status}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </Section>

      <Section tint sm>
        <Reveal>
          <div className="cols" style={{ marginBottom: 28 }}>
            <span className="label">Location</span>
            <div>
              <h2 className="h2">Vallakottai, Sriperumbudur.</h2>
              <p className="lead" style={{ marginTop: 12 }}>
                Inside the Chennai automotive manufacturing belt, close to the OEM and tier-one
                supply base we serve.
              </p>
            </div>
          </div>
          <div className="map">
            <iframe
              title="Map showing GRG Polydynamics, Vallakottai, Sriperumbudur"
              src="https://www.google.com/maps?q=Vallakottai%2C%20Sriperumbudur%2C%20Chennai%20631604&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
