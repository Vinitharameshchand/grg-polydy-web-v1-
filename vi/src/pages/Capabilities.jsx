import { CTA, PageHead, Reveal, Section, Split } from '../components/ui';
import { SectionNav } from '../components/scroll';
import { capabilitiesExtra, services } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';

const PROCESS_TABLE = [
  ['Material', 'Material selection and validation against application requirement', 'Approved material specification'],
  ['Tooling', 'Mould qualification and preventive maintenance schedule', 'Qualified, maintained tool'],
  ['Process', 'Parameter development, optimisation and lock-down', 'Released process sheet'],
  ['Production', 'Control plan monitoring and in-process inspection', 'Conforming components at volume']
];

const TRANSFER = [
  ['Transfer', 'Tool receipt, condition survey and validation against the incoming specification.'],
  ['PREP assessment', 'Structured assessment of tool readiness, wear items and required refurbishment.'],
  ['Stabilisation', 'Trial validation and parameter optimisation until output is repeatable and capable.'],
  ['Preventive maintenance', 'Scheduled PM intervals to protect cycle time, tool life and dimensional stability.']
];

export default function Capabilities() {
  usePageMeta(
    'Capabilities — GRG Polydynamics',
    'Product development, prototyping, mould making, precision injection moulding, painting and chrome plating, screen and pad printing, metal casting and tooling transfer support.'
  );

  const all = [...services, ...capabilitiesExtra];

  return (
    <>
      <PageHead
        crumb="Capabilities"
        title="Capabilities across the full part lifecycle."
        lead="Development, tooling, moulding and finishing under one roof — plus metal casting and structured tooling transfer support for programmes moving in from elsewhere."
      />

      <SectionNav items={all.map((s) => ({ id: s.id, label: s.title }))} />

      {/* detail sections */}
      {all.map((s, i) => (
        <Section key={s.id} id={s.id} tint={i % 2 === 1}>
          <Split image={s.image} alt={s.alt} caption={s.title} reverse={i % 2 === 1}>
            <span className="label">Capability {String(i + 1).padStart(2, '0')}</span>
            <h2 className="h2">{s.title}</h2>
            <p className="body-lg">{s.text}</p>
            <ul className="ticks">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Split>

          {s.id === 'injection-moulding' && (
            <Reveal className="table-scroll" style={{ marginTop: 'clamp(36px,4vw,60px)' }}>
              <table className="table">
                <caption className="sr-only">Injection moulding process controls</caption>
                <thead>
                  <tr>
                    <th scope="col">Stage</th>
                    <th scope="col">Control applied</th>
                    <th scope="col">Output</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESS_TABLE.map((r) => (
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
          )}

          {s.id === 'tooling-transfer' && (
            <div className="grid g4" style={{ marginTop: 'clamp(36px,4vw,60px)' }}>
              {TRANSFER.map(([t, d], n) => (
                <Reveal className="feature" key={t} delay={n * 60}>
                  <span className="feature__num">{String(n + 1).padStart(2, '0')}</span>
                  <h3 className="h3">{t}</h3>
                  <p>{d}</p>
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      ))}

      <CTA
        title="Tell us what you need manufactured."
        text="Drawings, volumes and application context are enough for us to start a feasibility view."
        primary={{ to: '/contact', label: 'Request a quote' }}
        secondary={{ to: '/npd', label: 'Development process' }}
      />
    </>
  );
}
