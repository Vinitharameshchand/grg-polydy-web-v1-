# Source content scraped from grgpolydynamics.com

Captured 3 September 2026 from the previous website (built by Vinkarr Technologies,
© 2025). This is the factual source for the new site's copy — everything below was
carried across.

## Company

**Legal name:** GRG POLYDYNAMICS PRIVATE LIMITED

> GRG Polydynamics Private Limited is a part of professionally managed Group of Companies
> which has global presence with 3 decades of business endeavors and turnover above 300 Crores.

> GRG Polydynamics Private Limited is a Plastics division started in the Year 2011 to serve
> Automotive & Non Automotive Customers.

> The Company has grown and expanded its operations into Precision & high quality plastic
> injection moulding components to Automotive Electrical/Electronics, Industrial/Machine &
> Consumer Products. The Company Engages product specific experts to support global customers
> to meet their requirements and achieve customer delight.

**Commitment statement (verbatim):**

> We at GRG Polydynamics are committed to implement and practice world class manufacturing with
> continuous improvements with the engagement of all the workers. This is evident in our current
> businesses. Our goal is to establish a long-term relationship with our customer which will
> benefit both the ends.

## Domain expertise

- Automotive
- Electrical
- Machine Components
- Consumer Products

## What we offer

- Product Development
- Prototyping
- Mould Making
- Plastic Part Production
- Painting, Chrome Plating
- Screen Pad Printing

## Contact

| Field | Value |
| --- | --- |
| Address | 2/2A, Vallam A Village, Palnallur Village, Vallakottai, Sriperumbudur, Chennai-631604, Tamil Nadu, India |
| Phone | +91-8754453333 |
| Phone / WhatsApp | +91-93808-82221 |
| Email | vkumar@grgpolydynamics.com |
| Response time | "Our Customer support team will get in touch within 48 business hours." |

## Published documents

31 policy PDFs plus the Sustainability Report 2024–2025, served from
`grgpolydynamics.com/Policy/`, `/EVS/` and `/Reports/`. All are linked from
[sustainability.html](sustainability.html); the source list lives in
[content/sustainability.js](content/sustainability.js).

**Two were already broken on the old site (HTTP 404 at their own published URL):**

- `Policy/Occupational Health and Safety Policy.pdf`
- `EVS/Wastewater Management Plan – SOP.pdf`

Both are marked "On request" on the new site instead of shipping as dead links. Upload the
files, remove the `false` flag on those two entries in `content/sustainability.js`, rebuild,
and re-run `npm run check:docs`.

## Old site structure

Three pages only: `index.html`, `Policy.html`, `contact-us.html` — a Bootstrap template with
jQuery, Swiper, Isotope, Lightbox and ~20 other vendor scripts. The nav advertised sections
(Facilities, Photos, Videos, and per-domain / per-service pages) that were never built; every
one of those links pointed at `#` or a non-existent `.html`.
