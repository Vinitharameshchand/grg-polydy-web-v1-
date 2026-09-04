import { CTA, PageHead, Reveal, Section, SectionHead } from '../components/ui';
import Gallery from '../components/Gallery';
import Img from '../components/Img';
import { productShots } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';

const FINISHES = [
  ['Moulded', 'Precision injection moulded in engineering-grade polymers, to drawing.'],
  ['Painted', 'Decorative and functional paint finishes applied in-house.'],
  ['Chrome plated', 'Plating on moulded components for appearance-critical parts.'],
  ['Printed', 'Screen and pad printing for graphics, legends and markings.']
];

export default function Products() {
  usePageMeta(
    'Products — GRG Polydynamics',
    'Precision moulded components: structural mouldings, appearance-critical trim, painted and chrome-plated parts for automotive, electrical, machine and consumer applications.'
  );

  return (
    <>
      <PageHead
        crumb="Products"
        title="Components we make."
        lead="Structural mouldings, appearance-critical trim and finished assemblies — moulded, painted, plated and printed in-house at Sriperumbudur."
      />

      <Section>
        <Gallery
          items={productShots.map(([name, title, kind]) => ({
            name,
            caption: `${title} — ${kind}`,
            alt: title
          }))}
        />
        <Reveal>
          <p className="muted" style={{ marginTop: 28, fontSize: 13.5, maxWidth: '62ch' }}>
            Parts shown are representative of work produced at our plant. Customer-specific
            components and drawings are treated as confidential and are not published.
          </p>
        </Reveal>
      </Section>

      <Section tint>
        <SectionHead label="Finishing" title="Moulded, finished and marked on one site.">
          <p className="lead">
            Keeping decoration alongside moulding shortens the loop between a surface defect and the
            process parameter that caused it — and removes a transport stage from the programme.
          </p>
        </SectionHead>

        <div className="grid g4">
          {FINISHES.map(([t, d], i) => (
            <Reveal className="feature" key={t} delay={i * 60}>
              <span className="feature__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3">{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="split">
          <Reveal as="figure" className="split__media">
            <Img
              name="display-cabinet"
              alt="Component display cabinet at the GRG Polydynamics plant"
              sizes="split"
            />
            <figcaption>Component display — plant reception</figcaption>
          </Reveal>
          <Reveal className="stack" delay={100}>
            <span className="label">Part range</span>
            <h2 className="h2">From small clips to large structural mouldings.</h2>
            <p className="body-lg">
              Our production covers a wide range of part sizes and geometries — from small
              functional clips and housings through to long structural mouldings and
              appearance-critical trim panels.
            </p>
            <ul className="ticks">
              <li>Structural and functional mouldings</li>
              <li>Housings, enclosures and switchgear parts</li>
              <li>Interior trim, louvres and grilles</li>
              <li>Painted, plated and printed finished parts</li>
            </ul>
          </Reveal>
        </div>
      </Section>

      <CTA
        title="Need a part like these?"
        text="Send your drawing and annual volume and we will come back with a feasibility view."
        primary={{ to: '/contact', label: 'Request a quote' }}
        secondary={{ to: '/capabilities', label: 'How we make them' }}
      />
    </>
  );
}
