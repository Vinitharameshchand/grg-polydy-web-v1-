import { CTA, PageHead, Reveal, Section, SectionHead, Split } from '../components/ui';
import Gallery from '../components/Gallery';
import { facilityShots } from '../data/site';

export default function Facility() {

  return (
    <>
      <PageHead
        crumb="Facility"
        title="Inside the plant."
        lead="Production floor, moulding machines, tool room and quality laboratory at Vallakottai, Sriperumbudur — the site that produces the components behind our capability claims."
      />

      <Section>
        <Gallery
          items={facilityShots.map(([name, caption, tall]) => ({
            name,
            caption,
            alt: `${caption} at the GRG Polydynamics plant`,
            tall
          }))}
        />
      </Section>

      <Section tint>
        <Split image="facility-signage" alt="GRG Polydynamics plant entrance" caption="Plant entrance" reverse>
          <span className="label label--bar label--sec">Visit us</span>
          <h2 className="h2">Customer audits and facility visits.</h2>
          <p className="body-lg">
            We welcome customer audits, supplier assessments and facility visits. Our plant is at
            Vallakottai, Sriperumbudur — inside the Chennai automotive belt and readily reachable
            from the city and airport.
          </p>
          <ul className="ticks">
            <li>Process and system audits against IATF 16949</li>
            <li>Supplier ESG and compliance assessments</li>
            <li>Programme kick-off and tooling review meetings</li>
          </ul>
        </Split>
      </Section>

      <CTA
        title="Want to visit or audit the plant?"
        text="Get in touch and we will arrange a date with our engineering and quality team."
        primary={{ to: '/contact', label: 'Arrange a visit' }}
        secondary={{ to: '/quality', label: 'Certifications' }}
      />
    </>
  );
}
