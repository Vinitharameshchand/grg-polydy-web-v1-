import { Link } from 'react-router-dom';
import { CTA, PageHead, Reveal, Section, SectionHead, Split } from '../components/ui';
import { certifications } from '../data/site';

const COMMITMENTS = [
  ['Automotive-grade manufacturing standards', 'IATF 16949', 'Control plans, traceability and disciplined change management on every part number'],
  ['Quality management systems', 'IATF 16949', 'Documented inspection, dimensional verification and corrective action'],
  ['Environmental responsibility', 'ISO 14001:2015', 'Controlled material use, waste segregation and monitored plant impact'],
  ['Supplier quality excellence', 'SQ Mark', 'Conformance and delivery performance measured and reviewed'],
  ['Sustainable and ethical manufacturing', 'ESG Certificate', 'Governed employment practice, resource use and long-term responsibility']
];

const CONTROLS = [
  ['In-process control', 'Parameters monitored against the released control plan throughout the production run.'],
  ['Dimensional verification', 'Sample and in-process inspection verified against drawing before release.'],
  ['Documentation package', 'PPAP, APQP, FMEA and Control Plan maintained and available for customer audit.']
];

export default function Quality() {

  return (
    <>
      <PageHead
        crumb="Quality"
        title="Quality, environment and ethics — certified."
        lead="Our certifications highlight GRG Polydynamics' commitment towards automotive-grade manufacturing standards, quality management systems, environmental responsibility, supplier quality excellence, and sustainable and ethical manufacturing practices."
      />

      <Section>
        <div className="certs">
          {certifications.map((c, i) => (
            <Reveal className="cert" key={c.name} delay={i * 50}>
              <h2 className="h3">{c.name}</h2>
              <p>{c.text}</p>
              <span>{c.kind}</span>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="note mt-4">
            Certificate copies are available on request. Please{' '}
            <Link className="text-link" to="/contact">
              contact us
            </Link>{' '}
            for current validity dates and scope statements.
          </p>
        </Reveal>
      </Section>

      <Section tint>
        <Split image="quality-lab" alt="Quality laboratory" caption="Quality laboratory" reverse>
          <span className="label label--bar label--sec">In the plant</span>
          <h2 className="h2">A quality lab, not just a quality manual.</h2>
          <p className="body-lg">
            Material and dimensional verification happen on site. Samples are checked against
            drawing before release, and in-process inspection runs against the same control plan the
            process was signed off to.
          </p>
          <ul className="ticks">
            <li>Melt flow index and material property testing</li>
            <li>Dimensional verification against drawing</li>
            <li>In-process and final inspection</li>
            <li>Non-conformance handling and corrective action</li>
          </ul>
        </Split>
      </Section>

      <Section>
        <SectionHead label="What certification means here" title="Our commitments." />
        <Reveal className="table-scroll">
          <table className="table">
            <caption className="sr-only">Certification commitments</caption>
            <thead>
              <tr>
                <th scope="col">Commitment</th>
                <th scope="col">Backed by</th>
                <th scope="col">How it shows up in production</th>
              </tr>
            </thead>
            <tbody>
              {COMMITMENTS.map((r) => (
                <tr key={r[0]}>
                  <td>
                    <strong>{r[0]}</strong>
                  </td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      <Section dark>
        <Reveal as="span" className="label label--bar label--sec head-gap" variant="fade">
          Process controls
        </Reveal>
        <div className="grid g3">
          {CONTROLS.map(([t, d], i) => (
            <Reveal className="feature" key={t} delay={i * 70}>
              <span className="feature__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3">{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA
        title="Need our certificate copies for supplier onboarding?"
        text="Request the current certificate set and scope statements from our quality team."
        primary={{ to: '/contact', label: 'Request certificates' }}
        secondary={{ to: '/sustainability', label: 'Policy library' }}
      />
    </>
  );
}
