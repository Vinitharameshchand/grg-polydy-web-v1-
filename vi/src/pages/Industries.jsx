import { CTA, PageHead, Reveal, Section, SectionHead, Split } from '../components/ui';
import { SectionNav } from '../components/scroll';
import { industries } from '../data/site';

const COMMON = [
  ['Documented process', 'Every part number runs against a released process sheet and control plan.'],
  ['Dimensional verification', 'Samples and in-process checks verified against drawing before release.'],
  ['Certified systems', 'IATF 16949, ISO 14001:2015, SQ Mark and ESG apply to the whole plant.']
];

export default function Industries() {

  return (
    <>
      <PageHead
        crumb="Industries"
        title="Our domain expertise."
        lead="Four sectors, each with its own acceptance criteria — served by one quality system and one set of documented process controls."
      />

      <SectionNav items={industries.map((i) => ({ id: i.id, label: i.title }))} label="Sectors" />

      {industries.map((ind, i) => (
        <Section key={ind.id} id={ind.id} tint={i % 2 === 1}>
          <Split image={ind.image} alt={ind.alt} reverse={i % 2 === 1}>
            <span className="label">Sector {String(i + 1).padStart(2, '0')}</span>
            <h2 className="h2">{ind.title}</h2>
            <p className="body-lg">{ind.text}</p>
            <ul className="ticks">
              {ind.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Split>
        </Section>
      ))}

      <Section dark>
        <SectionHead label="Common to every sector" title="What does not change between industries." />
        <div className="grid g3">
          {COMMON.map(([t, d], i) => (
            <Reveal className="feature" key={t} delay={i * 70}>
              <span className="feature__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3">{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA
        title="Does your part fit one of these sectors?"
        text="Send the drawing and annual volume — we will confirm feasibility against our process capability."
        primary={{ to: '/contact', label: 'Start an enquiry' }}
        secondary={{ to: '/capabilities', label: 'View capabilities' }}
      />
    </>
  );
}
