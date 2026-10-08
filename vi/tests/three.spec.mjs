/* WebGL scenes on the home page. Kept in their own file because headless
   Chromium renders WebGL in software: recording video or a trace on top of
   a live scene can stall page teardown, and those options can only be
   switched off per file. */
import { test, expect } from '@playwright/test';

test.use({ video: 'off', trace: 'off' });

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

test.describe('3D scenes', () => {
  const scrollStory = (page, p) =>
    page.evaluate((p) => {
      const s = document.querySelector('.p3d');
      const top = s.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + p * (s.offsetHeight - innerHeight), behavior: 'instant' });
    }, p);

  test('hero mould renders and the process story follows the scroll', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/');
    await expect(page.locator('.hero__3d.is-ready')).toHaveCount(1, { timeout: 20_000 });
    /* The canvas is decorative and must never take clicks from the hero. */
    expect(await page.locator('.hero__3d').evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');

    await scrollStory(page, 0.02);
    await expect(page.locator('.p3d')).toHaveClass(/p3d--live/, { timeout: 20_000 });
    await expect(page.locator('.p3d__steps li.is-active .p3d__title')).toHaveText('Material');

    await scrollStory(page, 0.66);
    await expect(page.locator('.p3d__steps li.is-active .p3d__title')).toHaveText('Ejection');
    await scrollStory(page, 0.99);
    await expect(page.locator('.p3d__steps li.is-active .p3d__title')).toHaveText('Inspection');
    const rail = await page.locator('.p3d__rail').evaluate((el) => parseFloat(el.style.getPropertyValue('--p')));
    expect(rail).toBeGreaterThan(0.95);
  });

  test('reduced motion: story is a plain list, hero is a still frame', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.p3d')).toHaveClass(/p3d--static/);
    await expect(page.locator('.p3d__canvas')).toBeHidden();
    await expect(page.locator('.p3d__steps li')).toHaveCount(5);
    for (const li of await page.locator('.p3d__steps li p').all()) await expect(li).toBeVisible();
  });

  test('without WebGL the page falls back cleanly', async ({ page }) => {
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return /webgl/i.test(type) ? null : orig.call(this, type, ...rest);
      };
    });
    await page.goto('/');
    await page.locator('.p3d').scrollIntoViewIfNeeded();
    await expect(page.locator('.p3d')).toHaveClass(/p3d--static/, { timeout: 10_000 });
    await expect(page.locator('.hero__3d.is-ready')).toHaveCount(0);
    await expect(page.locator('h1')).toBeVisible();
  });
});
