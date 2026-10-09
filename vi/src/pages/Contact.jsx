import { useState } from 'react';
import { Arrow, PageHead, Reveal, Section } from '../components/ui';
import { company } from '../data/site';

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

/* Submissions are emailed by Web3Forms (web3forms.com). The access key is
   public by design — it can only send to the inbox it was created for — and
   is read from VITE_WEB3FORMS_KEY at build time (see .env.example). */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

const INDUSTRIES = ['Automotive', 'Electrical & electronics', 'Industrial & machine', 'Consumer products', 'Other'];

export default function Contact() {

  /* { kind: 'sending' | 'sent' | 'error' | 'unconfigured', name } */
  const [status, setStatus] = useState(null);
  const sending = status?.kind === 'sending';

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (sending || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const first = String(data.name || '').trim().split(' ')[0];

    /* Honeypot: real visitors never see or tick this box. */
    if (data.botcheck) return;
    delete data.botcheck;

    if (!WEB3FORMS_KEY) {
      setStatus({ kind: 'unconfigured' });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Website enquiry: ${data.interest || 'General'}${data.company ? ' — ' + data.company : ''}`,
          from_name: 'GRG Polydynamics website',
          replyto: data.email,
          ...data
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
      setStatus({ kind: 'sent', name: first });
      form.reset();
    } catch {
      setStatus({ kind: 'error' });
    }
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
          <Reveal className="stack">
            <span className="label label--bar label--sec">Reach us</span>
            <h2 className="h2">{company.legalName}</h2>

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
              <h2 className="h3 form__title">
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

              {/* Honeypot for bots; hidden from people and assistive tech. */}
              <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <button className="btn btn--solid btn--block" type="submit" disabled={sending} aria-busy={sending}>
                {sending ? 'Sending…' : 'Send enquiry'}
                <Arrow />
              </button>

              <p className="form__note">
                Drawings and specifications can be emailed directly to{' '}
                <a href={`mailto:${company.email}`}>{company.email}</a>. All enquiries are treated
                as confidential.
              </p>

              <div aria-live="polite">
                {status?.kind === 'sent' && (
                  <p className="form__status" role="status">
                    Thank you{status.name ? ', ' + status.name : ''}. Your enquiry has been sent. Our team
                    will respond within 48 business hours.
                  </p>
                )}
                {(status?.kind === 'error' || status?.kind === 'unconfigured') && (
                  <p className="form__status form__status--error" role="alert">
                    {status.kind === 'error'
                      ? 'Your enquiry could not be sent — please check your connection and try again, or '
                      : 'The online form is not available right now. Please '}
                    email us at <a href={`mailto:${company.email}`}>{company.email}</a>
                    {status.kind === 'error' ? '.' : ' or call ' + company.phone + '.'}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </Section>

      <Section tint sm>
        <Reveal>
          <div className="cols cols--head">
            <span className="label label--bar label--sec">Location</span>
            <div className="stack">
              <h2 className="h2">Vallakottai, Sriperumbudur.</h2>
              <p className="lead">
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
