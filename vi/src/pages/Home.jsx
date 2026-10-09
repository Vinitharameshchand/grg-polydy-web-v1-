import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Arrow,
  CTA,
  ColumnGuide,
  CountUp,
  Reveal,
  Section,
  SectionHead,
  Split,
  Ticker,
  useParallax
} from '../components/ui';
import Gallery from '../components/Gallery';
import Img from '../components/Img';
import Tilt from '../components/Tilt';
import Hero3D from '../components/Hero3D';
import Process3D from '../components/Process3D';
import { SplitText } from '../components/AnimText';
import { ScrollCue } from '../components/scroll';
import { useScrollShift } from '../hooks/useScroll';
import { certifications, industries, productShots, services, stats } from '../data/site';

const TICKER = [
  'IATF 16949 certified',
  'ISO 14001:2015 certified',
  'SQ Mark',
  'ESG certified',
  'Plastics division since 2011',
  'Sriperumbudur, Chennai',
  'Automotive · Electrical · Machine · Consumer'
];

export default function Home() {

  const parallaxRef = useRef(null);
  useParallax(parallaxRef, 0.08, 40); /* stays inside the 9% bleed of the parallax layer */

  /* Hero copy and backdrop drift at different rates as the page leaves,
     giving the masthead depth without moving anything the reader needs. */
  const copyRef = useRef(null);
  const gridRef = useRef(null);
  useScrollShift(copyRef, 0.16, 90);
  useScrollShift(gridRef, 0.34, 200);


  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="hero hero--dark hero--3d">
        {/* Photograph behind the type, drifting slower than the page. */}
        <div className="hero__media" ref={parallaxRef} aria-hidden="true">
          <Img
            name="shopfloor-wide"
            alt=""
            sizes="hero"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <span className="hero__scrim" aria-hidden="true" />
        <span className="hero__bg" aria-hidden="true">
          <span className="hero__rule" ref={gridRef}>
            <ColumnGuide />
          </span>
        </span>
        {/* Injection mould in WebGL; loads after first paint. */}
        <Hero3D />

        <div className="wrap hero__inner">
          <div className="hero__copy" ref={copyRef}>
            <Reveal as="span" className="label label--bar">
              Sriperumbudur, Chennai
            </Reveal>
            <h1 className="display">
              <SplitText as="span" text="Precision mouldings," stagger={0.055} />
              <br />
              <SplitText as="span" text="made to" stagger={0.055} start={0.2} />{' '}
              <SplitText as="span" className="hero__em" text="specification." stagger={0.055} start={0.32} />
            </h1>
            <Reveal delay={480} className="stack">
              <p className="lead">
                GRG Polydynamics Private Limited produces precision, high-quality plastic injection
                moulded components for automotive, electrical and electronics, industrial machine
                and consumer product customers.
              </p>
              <div className="btn-row">
                <Link className="btn btn--accent" to="/capabilities">
                  Explore capabilities
                  <Arrow />
                </Link>
                <Link className="btn btn--line" to="/products">
                  See our parts
                </Link>
              </div>
              <ScrollCue to="what-we-offer" />
            </Reveal>
          </div>

          <Tilt max={4} lift={16} glare={false}>
          <Reveal as="ul" className="hero__panel" variant="fade" delay={700} aria-label="Key figures">
            {stats.map((s) => (
              <li key={s.label}>
                <strong>
                  <CountUp value={s.value} />
                </strong>
                <span>{s.label}</span>
              </li>
            ))}
          </Reveal>
          </Tilt>
        </div>

        <span className="hero__tag">Vallakottai, Sriperumbudur</span>
      </section>

      <Ticker items={TICKER} />

      {/* ---------------- who we are ---------------- */}
      <Section>
        <div className="cols">
          <Reveal as="span" className="label label--bar label--sec">
            Who we are
          </Reveal>
          <Reveal className="stack" delay={80}>
            <h2 className="h2">A plastics division backed by three decades of group business.</h2>
            <p className="body-lg">
              Part of a professionally managed group with a global presence, three decades of
              business and a turnover above ₹300 crores. The plastics division was started in 2011,
              and now engages product-specific experts to support customers worldwide.
            </p>
            <Link className="link" to="/about">
              About the company
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- process, in 3D ---------------- */}
      <Process3D />

      {/* ---------------- capabilities ---------------- */}
      <Section dark id="what-we-offer">
        <SectionHead label="What we offer" title="One supplier, from concept to finished part.">
          <p className="lead">
            Development, tooling, moulding and finishing are handled under one roof — removing the
            hand-offs where programmes usually lose time.
          </p>
        </SectionHead>

        <div className="grid g3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80} variant="3d">
              <Tilt max={7} lift={14}>
              <Link className="card" to={`/capabilities#${s.id}`}>
                <span className="card__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.short}</p>
                <span className="link">
                  Learn more
                  <Arrow />
                </span>
              </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-5">
          <Link className="link" to="/capabilities">
            All capabilities, including metal casting and tooling transfer
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      {/* ---------------- products ---------------- */}
      <Section>
        <SectionHead label="Our parts" title="Components we make.">
          <p className="lead">
            Structural mouldings, appearance-critical trim and finished assemblies — moulded,
            painted, plated and printed in-house.
          </p>
        </SectionHead>

        <Gallery
          items={productShots.slice(0, 6).map(([name, title, kind]) => ({
            name,
            caption: title,
            meta: kind,
            alt: title
          }))}
        />

        <Reveal className="mt-5">
          <Link className="link" to="/products">
            View the product gallery
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      {/* ---------------- industries ---------------- */}
      <Section tint>
        <SectionHead label="Domain expertise" title="Four industries, one quality system.">
          <p className="lead">
            The same IATF 16949 discipline governs every part number we run, whatever sector it
            ships into.
          </p>
        </SectionHead>

        <div className="grid g4">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={i * 70} variant="3d">
              <Tilt max={6} lift={10}>
              <Link className="tile" to={`/industries#${ind.id}`}>
                <div className="tile__media">
                  <Img name={ind.image} alt={ind.alt} sizes="tile" />
                  <span className="tile__arrow" aria-hidden="true">
                    <Arrow />
                  </span>
                </div>
                <h3 className="h3">{ind.title}</h3>
                <p>{ind.short}</p>
              </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- NPD ---------------- */}
      <Section>
        <Split
          image="mould-handling"
          alt="Mould being prepared in the tool room"
          caption="Tooling — mould preparation"
          reverse
        >
          <span className="label label--bar label--sec">New product development</span>
          <h2 className="h2">A dedicated NPD team, from feasibility to mass production.</h2>
          <p className="body-lg">
            Our NPD function carries a programme from customer requirement review through tool
            qualification, process development and PPAP submission — into a stable, launched
            production line.
          </p>
          <ul className="ticks">
            <li>Customer requirement review and feasibility study</li>
            <li>Product design evaluation and DFM analysis</li>
            <li>Tooling concept development and tool design approval</li>
            <li>PPAP, APQP, FMEA, Control Plan and quality documentation</li>
            <li>Mass production launch and continuous improvement</li>
          </ul>
          <Link className="link" to="/npd">
            The full ten-stage process
            <Arrow />
          </Link>
        </Split>
      </Section>

      {/* ---------------- certifications ---------------- */}
      {/* Named here, explained on /quality — the full descriptions used to run
          on both pages. */}
      <Section tint>
        <SectionHead label="Quality" title="Certified systems, verified practice." />
        <Reveal as="ul" className="certstrip">
          {certifications.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong>
              <span>{c.kind}</span>
            </li>
          ))}
        </Reveal>
        <Reveal className="mt-5">
          <Link className="link" to="/quality">
            What each certification commits us to
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      <CTA
        title="Have a component, a tool, or a programme to move?"
        text="Share your drawings and volumes. Our NPD team will return a feasibility view and an indicative development plan."
        primary={{ to: '/contact', label: 'Start an enquiry' }}
        secondary={{ to: '/facility', label: 'See the facility' }}
      />
    </>
  );
}
