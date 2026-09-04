/** Shared section builders used by the page content modules. */

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const shield =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2 4 6v6c0 5 3.4 9 8 10 4.6-1 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>';

/** Dark interior page banner with breadcrumb. */
function pageHead({ crumb, title, lead, tags }) {
  return `
  <section class="page-head">
    <div class="hero__grid" aria-hidden="true"></div>
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="wrap page-head__inner">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>${crumb}</nav>
      <h1 class="h1">${title}</h1>
      <p class="lead">${lead}</p>${
        tags
          ? `
      <div class="hero__tags">${tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>`
          : ''
      }
    </div>
  </section>`;
}

/** Closing call-to-action band. */
function ctaBand({ title, text, primary, secondary }) {
  return `
  <section class="cta-band">
    <div class="hero__grid" aria-hidden="true"></div>
    <div class="wrap cta-band__inner">
      <div data-reveal>
        <h2 class="h2">${title}</h2>
        <p>${text}</p>
      </div>
      <div class="btn-row" style="margin-top:0" data-reveal data-reveal-delay="100">
        <a class="btn btn--primary" href="${primary.href}">${primary.label}${arrow}</a>${
          secondary
            ? `
        <a class="btn btn--ghost" href="${secondary.href}">${secondary.label}</a>`
            : ''
        }
      </div>
    </div>
  </section>`;
}

/** Child-labour compliance banner. */
function compliance(note, cta) {
  return `<div class="compliance" data-reveal>
        <div class="compliance__icon">${shield}</div>
        <div class="compliance__text">
          <strong>No child labour is employed at GRG Polydynamics Private Limited.</strong>
          <p>${note}</p>
        </div>${
          cta
            ? `
        <a class="btn btn--primary" href="${cta.href}">${cta.label}</a>`
            : ''
        }
      </div>`;
}

module.exports = { pageHead, ctaBand, compliance, arrow, shield };
