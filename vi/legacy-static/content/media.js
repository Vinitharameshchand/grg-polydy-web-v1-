const { pageHead, ctaBand } = require('./_partials');

const PHOTOS = [
  ['factory-floor', 'Factory Infrastructure'],
  ['machine-operation', 'Injection Moulding Machines'],
  ['casting-process', 'Metal Casting Process'],
  ['tool-room', 'Tool Room'],
  ['quality-lab', 'Quality Inspection'],
  ['team-operations', 'Team &amp; Operations'],
  ['product-closeup', 'Product Close-ups'],
  ['npd-team', 'NPD Activities'],
  ['about-plant', 'Plant Infrastructure']
];

const VIDEOS = [
  ['video-walkthrough', 'Factory Walkthrough'],
  ['video-npd', 'NPD Activities'],
  ['video-tooling', 'Tooling Process'],
  ['video-quality', 'Quality Control Process'],
  ['video-workflow', 'Production Workflow'],
  ['video-founder', 'Founder Introduction']
];

const tile = (cls) => ([slug, caption], i) =>
  `        <figure class="shot${cls}" data-reveal${i ? ` data-reveal-delay="${(i % 3) * 60}"` : ''}>
          <img src="assets/img/${slug}.svg" alt="${caption.replace(/&amp;/g, 'and')}" loading="lazy" width="1200" height="750">
          <figcaption class="shot__cap">${caption}</figcaption>
        </figure>`;

module.exports = {
  file: 'media.html',
  nav: 'Facility',
  title: 'Facility &amp; Media — GRG Polydynamics',
  description:
    'Facility photography and video — factory infrastructure, injection moulding machines, metal casting, tool room, quality inspection and production workflow.',
  body: `${pageHead({
    crumb: 'Facility &amp; Media',
    title: 'Inside the facility',
    lead:
      'Infrastructure, machines, tool room and quality operations at our Vallakottai, Sriperumbudur plant &mdash; the site that produces the components behind our capability claims.'
  })}

  <section class="section">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">Photography</p>
        <h2 class="h2">Facility &amp; operations</h2>
      </div>
      <div class="gallery">
${PHOTOS.map(tile('')).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <p class="eyebrow">Video</p>
        <h2 class="h2">Process films</h2>
        <p class="lead">Walkthroughs and process films covering how work moves through the plant.</p>
      </div>
      <div class="gallery">
${VIDEOS.map(tile(' shot--video')).join('\n')}
      </div>
      <p class="muted mt-24 note">
        Video tiles are placeholders. Replace each with an embedded player or a poster image linked
        to the final film &mdash; see <code>README.md</code> for the exact markup.
      </p>
    </div>
  </section>

  <section class="section section--dark section--tight">
    <div class="wrap">
      <div class="split">
        <div data-reveal>
          <p class="eyebrow">Visit Us</p>
          <h2 class="h2">Customer audits and facility visits</h2>
          <p class="lead mt-16">We welcome customer audits, supplier assessments and facility
            visits. Our plant is at Vallakottai, Sriperumbudur &mdash; inside the Chennai
            automotive belt and readily reachable from the city and airport.</p>
          <ul class="ticks mt-24">
            <li>Process and system audits against IATF 16949</li>
            <li>Supplier ESG and compliance assessments</li>
            <li>Programme kick-off and tooling review meetings</li>
          </ul>
        </div>
        <div class="split__media" data-reveal data-reveal-delay="120">
          <img src="assets/img/factory-floor.svg" alt="GRG Polydynamics factory floor" loading="lazy" width="1200" height="750">
          <span class="split__badge">Vallakottai, Sriperumbudur</span>
        </div>
      </div>
    </div>
  </section>
${ctaBand({
  title: 'Want to visit or audit the plant?',
  text: 'Get in touch and we will arrange a date with our engineering and quality team.',
  primary: { href: 'contact.html', label: 'Arrange a Visit' },
  secondary: { href: 'quality.html', label: 'Certifications' }
})}
`
};
