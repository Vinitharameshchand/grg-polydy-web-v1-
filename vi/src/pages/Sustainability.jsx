import { CTA, Compliance, Download, PageHead, Reveal, Section, SectionHead } from '../components/ui';
import { DOC_BASE, policyCount, policyGroups, sustainabilityReport } from '../data/site';

const PILLARS = [
  ['Environment', 'Environment, biodiversity, waste and wastewater policies under an ISO 14001:2015 management system.'],
  ['Energy & emissions', 'Energy and energy-usage policies with a published GHG reduction goal.'],
  ['Water', 'Water management and usage policies, with a documented wastewater management SOP.'],
  ['People & governance', 'Child labour, forced labour, POSH, wage equality, ethics and whistleblower policies.']
];

const docUrl = (file) => DOC_BASE + encodeURI(file);

export default function Sustainability() {

  return (
    <>
      <PageHead
        crumb="Sustainability"
        title="Sustainability, governance and published policy."
        lead="Our ESG commitments are written down and published. Every policy below is a live document governing how the plant operates — available to customers, auditors and our own people."
      />

      <Section sm>
        <Reveal>
          <a className="report" href={docUrl(sustainabilityReport[1])} target="_blank" rel="noopener noreferrer">
            <div>
              <span className="label label--accent">Latest report</span>
              <h2 className="h3">{sustainabilityReport[0]}</h2>
              <p>
                Our annual account of environmental, social and governance performance — energy,
                water, waste, emissions and workplace practice.
              </p>
            </div>
            <span className="btn btn--solid">
              Download PDF
              <Download />
            </span>
          </a>
        </Reveal>
      </Section>

      <Section tint>
        <SectionHead label="Our approach" title="Four pillars, documented and audited.">
          <p className="lead">
            ESG certification and ISO 14001:2015 require evidence, not intent. These are the areas
            we measure and publish against.
          </p>
        </SectionHead>
        <div className="grid g4">
          {PILLARS.map(([t, d], i) => (
            <Reveal className="feature" key={t} delay={i * 60}>
              <span className="feature__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3">{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead label="Policy library" title={`${policyCount} published policies.`}>
          <p className="lead">Grouped by area. Each opens the current signed document as a PDF.</p>
        </SectionHead>

        {policyGroups.map((g, gi) => (
          <Reveal className="policy-group" key={g.id} id={g.id} delay={gi * 40}>
            <header className="policy-group__head">
              <div>
                <h3 className="h3">{g.title}</h3>
                <p>{g.note}</p>
              </div>
              <span className="label">{g.docs.length} documents</span>
            </header>
            <ul className="policy-list">
              {g.docs.map(([label, file, uploaded]) =>
                uploaded === false ? (
                  <li key={label}>
                    <span className="pending">
                      {label}
                      <em>On request</em>
                    </span>
                  </li>
                ) : (
                  <li key={label}>
                    <a href={docUrl(file)} target="_blank" rel="noopener noreferrer">
                      {label}
                      <em>PDF</em>
                    </a>
                  </li>
                )
              )}
            </ul>
          </Reveal>
        ))}
      </Section>

      <Section dark sm>
        <Compliance note="Published as a formal Child Labour Policy alongside our Forced Labour, Ethical Hiring and Wage Equality policies, and audited under our ESG commitments." />
      </Section>

      <CTA
        title="Running a supplier ESG or compliance assessment?"
        text="We can supply signed policy copies, certificate scopes and our latest sustainability report directly."
        primary={{ to: '/contact', label: 'Contact our team' }}
        secondary={{ to: '/quality', label: 'Certifications' }}
      />
    </>
  );
}
