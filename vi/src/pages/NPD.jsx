import { CTA, PageHead, Reveal, Section, SectionHead, Split } from '../components/ui';
import { ProcessTrack } from '../components/scroll';
import { npdStages } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';

const NEEDS = [
  ['Part drawing', '2D drawing or 3D model with tolerances and critical characteristics identified.'],
  ['Annual volume', 'Expected annual quantity and any known ramp profile, so cavitation can be sized.'],
  ['Target timeline', 'Required SOP date, so tooling lead time and validation can be planned backwards.'],
  ['Application context', 'Operating environment, material preference and any regulatory requirement.']
];

const DELIVERABLES = [
  'Feasibility and DFM report',
  'Approved tool design and qualification record',
  'Material validation record',
  'Released process parameter sheet',
  'Dimensional verification report',
  'PPAP submission with FMEA and Control Plan',
  'Production readiness review sign-off'
];

export default function NPD() {
  usePageMeta(
    'Product Development — GRG Polydynamics',
    'A dedicated NPD team supporting complete product development and production readiness: feasibility, DFM, tooling, validation, PPAP and mass production launch.'
  );

  return (
    <>
      <PageHead
        crumb="Development"
        title="New product development."
        lead="A dedicated NPD team supporting complete product development and production readiness activities — from the first feasibility review to a stabilised, launched production line."
      />

      <Section>
        <SectionHead label="The process" title="Ten stages from requirement to mass production.">
          <p className="lead">
            Each stage has a defined input, a defined output and a gate that must be closed before
            the programme moves forward.
          </p>
        </SectionHead>

        <ProcessTrack>
          <div className="rows">
            {npdStages.map(([title, text], i) => (
              <Reveal className="row" key={title} delay={i * 25}>
                <span className="row__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{title}</h3>
                <div className="row__body">
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </ProcessTrack>
      </Section>

      <Section tint>
        <Split
          image="office-npd"
          alt="Engineering office at GRG Polydynamics"
          caption="Engineering office"
          reverse
        >
          <span className="label">Deliverables</span>
          <h2 className="h2">What you receive at each gate.</h2>
          <p className="body-lg">
            Every NPD programme produces a documented, auditable trail — the same package our
            IATF 16949 system requires internally.
          </p>
          <ul className="ticks">
            {DELIVERABLES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Split>
      </Section>

      <Section>
        <SectionHead label="Working with us" title="What we need to start." />
        <div className="grid g4">
          {NEEDS.map(([t, d], i) => (
            <Reveal className="feature" key={t} delay={i * 60}>
              <span className="feature__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3">{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA
        title="Have a new part to develop?"
        text="Send the drawing and target volumes — we will come back with a feasibility view and an indicative development timeline."
        primary={{ to: '/contact', label: 'Start an enquiry' }}
        secondary={{ to: '/capabilities', label: 'View capabilities' }}
      />
    </>
  );
}
