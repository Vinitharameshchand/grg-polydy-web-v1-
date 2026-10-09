import { CTA, PageHead, Reveal, Section, SectionHead, Split } from '../components/ui';

const MODEL = [
  ['Requirement first.', 'Nothing enters the plant before a customer requirement review and feasibility study is closed.'],
  ['Design for manufacturability.', 'Product design is evaluated for mouldability, tolerance capability and tooling implication before commitment.'],
  ['Qualify the tool.', 'Moulds are manufactured and qualified against a defined acceptance standard, not a trial-and-error loop.'],
  ['Lock the process.', 'Parameters are developed, optimised and captured in a control plan that production runs against.'],
  ['Prove it dimensionally.', 'Sample production is verified against drawing before PPAP submission.'],
  ['Improve continuously.', 'Post-launch performance feeds back into parameters, maintenance intervals and documentation.']
];

export default function About() {

  return (
    <>
      <PageHead
        crumb="About"
        title="Group strength, applied to precision moulding."
        lead="GRG Polydynamics Private Limited is part of a professionally managed group of companies with a global presence, three decades of business endeavours and a turnover above ₹300 crores."
      />

      <Section>
        <Split
          image="facility-exterior"
          alt="GRG Polydynamics plant at Vallakottai, Sriperumbudur"
          caption="Vallakottai, Sriperumbudur"
          eager
        >
          <span className="label label--bar label--sec">The company</span>
          <h2 className="h2">A plastics division built to serve global customers.</h2>
          <p className="body-lg">
            GRG Polydynamics Private Limited is a plastics division started in the year 2011 to
            serve automotive and non-automotive customers.
          </p>
          <p className="body-lg">
            The company has grown and expanded its operations into precision and high-quality
            plastic injection moulding components for automotive, electrical and electronics,
            industrial and machine, and consumer product applications. The company engages
            product-specific experts to support global customers, meet their requirements and
            achieve customer delight.
          </p>
          <p className="body-lg">
            Operations are based at Vallakottai, Sriperumbudur — inside the Chennai automotive
            manufacturing belt, close to the OEM and tier-one supply base we serve.
          </p>
        </Split>
      </Section>

      <Section tint sm>
        <Reveal as="blockquote" className="statement">
          <p>
            “We at GRG Polydynamics are committed to implement and practice world class
            manufacturing with continuous improvements with the engagement of all the workers. This
            is evident in our current businesses. Our goal is to establish a long-term relationship
            with our customer which will benefit both the ends.”
          </p>
          <footer className="label label--bar label--sec">Our commitment</footer>
        </Reveal>
      </Section>

      <Section dark>
        <SectionHead label="How we operate" title="The operating model." />
        <div className="grid g2">
          <Reveal>
            <ul className="ticks">
              {MODEL.slice(0, 3).map(([b, t]) => (
                <li key={b}>
                  <strong>{b}</strong> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}>
            <ul className="ticks">
              {MODEL.slice(3).map(([b, t]) => (
                <li key={b}>
                  <strong>{b}</strong> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

      </Section>

      <CTA
        title="Looking for a qualified manufacturing partner?"
        text="Send us your part drawings, annual volumes and target timeline."
        primary={{ to: '/contact', label: 'Contact us' }}
        secondary={{ to: '/industries', label: 'Industries we serve' }}
      />
    </>
  );
}
