import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/about', '/capabilities', '/industries', '/products', '/npd', '/quality', '/sustainability', '/facility', '/contact'];

/* Collect console errors and failed requests for every test. */
test.beforeEach(async ({ page }, info) => {
  info.errors = [];
  page.on('console', (m) => m.type() === 'error' && info.errors.push('console: ' + m.text()));
  page.on('pageerror', (e) => info.errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => info.errors.push('request failed: ' + r.url()));
  /* Subresources only: a test that navigates to a missing URL expects the
     document itself to be a 404. */
  page.on('response', (r) => r.status() >= 400 && r.request().resourceType() !== 'document' && info.errors.push(`HTTP ${r.status()} ${r.url()}`));
});
test.afterEach(async ({}, info) => {
  /* A test may declare that it deliberately loaded a missing document; Chrome
     echoes that 404 to the console and it is not a defect. Nothing else is
     filtered. */
  const errors = info.expect404
    ? info.errors.filter((e) => !/status of 404/.test(e))
    : info.errors;
  expect(errors, 'no console errors, page errors or failed requests').toEqual([]);
});

test.describe('routes', () => {
  /* Static checks only. Reduced motion pins the WebGL scenes to a still
     frame: headless Chromium renders WebGL in software, and a live scene
     plus video capture can push page teardown past the timeout. The live
     scenes are covered in "3D scenes" below. */
  test.use({ reducedMotion: 'reduce' });

  for (const route of ROUTES) {
    test(`${route} renders with one h1 and no broken images`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
      expect(broken, 'broken images').toEqual([]);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
    });
  }

  test('unknown URL shows the 404 page', async ({ page }, info) => {
    info.expect404 = true;
    const res = await page.goto('/this-does-not-exist');
    expect([404, 200]).toContain(res.status());
    await expect(page.locator('h1')).toContainText(/does not exist/i);
  });
});

test.describe('navigation', () => {
  test('sticky nav links scroll to their section, not to a 404', async ({ page }) => {
    await page.goto('/capabilities');
    /* The index rows were removed as duplicate navigation; the sticky
       SectionNav is now the only in-page nav. */
    await page.locator('.secnav__list a').first().click();
    await expect(page).toHaveURL(/\/capabilities\/?#product-development/);
    await expect(page.locator('h1')).not.toContainText(/does not exist/i);
    await page.waitForTimeout(1600);
    const top = await page.locator('#product-development').evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(-5);
    expect(top).toBeLessThanOrEqual(150);
  });

  test('footer deep link lands on the section on another page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.footer a[href*="metal-casting"]').click();
    await expect(page).toHaveURL(/\/capabilities\/?#metal-casting/);
    await page.waitForTimeout(2200);
    const top = await page.locator('#metal-casting').evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(-5);
    expect(top).toBeLessThanOrEqual(150);
  });

  test('sticky section nav highlights the section in view', async ({ page }) => {
    await page.goto('/capabilities');
    /* Put the section's top 100px below the viewport top — the reading line
       the scroll-spy uses. scrollIntoViewIfNeeded() centres it, which leaves
       the previous section still current. */
    await page.locator('#metal-casting').evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await expect(page.locator('.secnav__list a.is-active')).toHaveText('Metal Casting');
  });
});

test.describe('keyboard and dialogs', () => {
  test('mobile drawer is inert when closed, traps focus when open, restores on Escape', async ({ page }, info) => {
    test.skip(info.project.name !== 'phone', 'drawer only exists below 1200px');
    await page.goto('/');
    const closedFocusable = await page.$$eval('.drawer a[href]', (as) => as.filter((a) => { a.focus(); return document.activeElement === a; }).length);
    expect(closedFocusable, 'links reachable while drawer is closed').toBe(0);

    await page.locator('.burger').click();
    await expect(page.locator('.drawer')).toHaveClass(/is-open/);
    await page.waitForTimeout(700);
    const focusInside = await page.evaluate(() => document.querySelector('.drawer').contains(document.activeElement));
    expect(focusInside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(page.locator('.drawer')).not.toHaveClass(/is-open/);
    await page.waitForTimeout(400);
    const onBurger = await page.evaluate(() => document.activeElement === document.querySelector('.burger'));
    expect(onBurger, 'focus returned to the burger').toBe(true);
  });

  test('gallery lightbox: opens, arrows, Escape, focus returns', async ({ page }) => {
    await page.goto('/facility');
    const tile = page.locator('.shot__btn').first();
    await tile.scrollIntoViewIfNeeded();
    await tile.focus();
    await tile.click();
    const dlg = page.locator('.lb[role="dialog"]');
    await expect(dlg).toBeVisible();
    await expect(page.locator('.lb__count')).toHaveText(/1 \/ \d+/);
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.lb__count')).toHaveText(/2 \/ \d+/);
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    /* Restoration happens on the next animation frame; poll rather than read once. */
    await expect.poll(() => page.evaluate(() => document.activeElement === document.querySelector('.shot__btn')), {
      message: 'focus returned to the tile', timeout: 3000
    }).toBe(true);
  });

  /* The form posts to Web3Forms. Build with any VITE_WEB3FORMS_KEY (e.g.
     "e2e") so the form is configured; the endpoint itself is mocked here, so
     no real email is sent. */
  const fillForm = async (page) => {
    await page.fill('#name', 'Playwright');
    await page.fill('#email', 'pw@example.com');
    await page.selectOption('#interest', { index: 1 });
    await page.fill('#message', 'Live test');
  };

  test('contact form blocks empty submit and sends a valid one', async ({ page }) => {
    let sent = null;
    await page.route('https://api.web3forms.com/submit', async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, message: 'Email sent successfully!' } });
    });
    await page.goto('/contact');
    await page.locator('#enquiry-form button[type=submit]').click();
    await expect(page.locator('.form__status')).toHaveCount(0);
    expect(sent, 'nothing sent for an invalid form').toBeNull();

    await fillForm(page);
    await page.locator('#enquiry-form button[type=submit]').click();
    await expect(page.locator('.form__status')).toContainText(/Thank you, Playwright/);
    expect(sent).toMatchObject({ name: 'Playwright', email: 'pw@example.com', message: 'Live test' });
    expect(sent.access_key, 'built with VITE_WEB3FORMS_KEY').toBeTruthy();
    expect(sent.botcheck).toBeUndefined();
    await expect(page.locator('#name')).toHaveValue('');
  });

  test('contact form reports a failed send and keeps the input', async ({ page }) => {
    await page.route('https://api.web3forms.com/submit', (route) =>
      route.fulfill({ json: { success: false, message: 'Invalid access key' } })
    );
    await page.goto('/contact');
    await fillForm(page);
    await page.locator('#enquiry-form button[type=submit]').click();
    await expect(page.locator('.form__status--error')).toContainText(/could not be sent/);
    await expect(page.locator('#name')).toHaveValue('Playwright');
  });
});

test.describe('3D depth', () => {
  test('cards tilt toward a real mouse pointer and settle back', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'hover needs a mouse');
    await page.goto('/');
    const wrap = page.locator('.grid .tilt').first();
    await wrap.scrollIntoViewIfNeeded();
    const box = await wrap.boundingBox();

    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.15);
    await page.waitForTimeout(250);
    const a = await wrap.evaluate((el) => ({
      rx: parseFloat(getComputedStyle(el).getPropertyValue('--rx')),
      ry: parseFloat(getComputedStyle(el).getPropertyValue('--ry')),
      tilting: el.classList.contains('is-tilting'),
      matrix: getComputedStyle(el.firstElementChild).transform
    }));
    expect(a.tilting).toBe(true);
    expect(a.matrix).toMatch(/^matrix3d/);
    expect(a.rx).toBeGreaterThan(0);
    expect(a.ry).toBeGreaterThan(0);

    await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.85);
    await page.waitForTimeout(250);
    const b = await wrap.evaluate((el) => ({
      rx: parseFloat(getComputedStyle(el).getPropertyValue('--rx')),
      ry: parseFloat(getComputedStyle(el).getPropertyValue('--ry'))
    }));
    expect(b.rx).toBeLessThan(0);
    expect(b.ry).toBeLessThan(0);

    await page.mouse.move(5, 5);
    await page.waitForTimeout(800);
    const c = await wrap.evaluate((el) => ({
      rx: parseFloat(getComputedStyle(el).getPropertyValue('--rx')),
      tilting: el.classList.contains('is-tilting')
    }));
    expect(c.rx).toBe(0);
    expect(c.tilting).toBe(false);
  });

  test('on a phone the stat panel sits at a fixed 3D angle and is sized to content', async ({ page }, info) => {
    test.skip(info.project.name !== 'phone', 'touch behaviour');
    await page.goto('/');
    const r = await page.locator('.hero__panel').evaluate((el) => ({
      matrix: getComputedStyle(el).transform,
      panel: el.getBoundingClientRect().height,
      hero: document.querySelector('.hero').getBoundingClientRect().height,
      tilting: el.parentElement.classList.contains('is-tilting')
    }));
    expect(r.matrix).toMatch(/^matrix3d/);
    expect(r.panel).toBeLessThan(r.hero * 0.6);
    expect(r.tilting).toBe(false);
  });
});

test.describe('scroll animation', () => {
  test('process track fills as the list is scrolled', async ({ page }) => {
    await page.goto('/npd');
    const fill = page.locator('.track__fill');
    const read = () => fill.evaluate((el) => { const m = getComputedStyle(el).transform.match(/matrix\(([^)]+)\)/); return m ? parseFloat(m[1].split(',')[3]) : 0; });
    await page.locator('.track').evaluate((el) => scrollTo({ top: el.offsetTop - 300 }));
    await page.waitForTimeout(400);
    const start = await read();
    await page.locator('.track').evaluate((el) => scrollTo({ top: el.offsetTop + el.offsetHeight - 300 }));
    await page.waitForTimeout(400);
    const end = await read();
    expect(end).toBeGreaterThan(start + 0.3);
  });
});
