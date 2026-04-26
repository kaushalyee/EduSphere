import { test, expect } from '@playwright/test';

test('Tutor can create a peer learning session', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.locator('input').nth(0).fill('tutor@mail.com');
  await page.locator('input').nth(1).fill('tutor');

  await page.locator('button').first().click();

  await page.waitForURL('**/tutor/dashboard');

  // Click sidebar tab
  await page.getByText('Create Session').click();

  await expect(
    page.getByText('Add a new peer learning session for students.')
  ).toBeVisible();

  await page.selectOption('select[name="category"]', { index: 1 });
  await page.selectOption('select[name="topic"]', { index: 1 });

  await page.fill('input[name="date"]', '2026-05-10');
  await page.fill('input[name="time"]', '15:30');
  await page.fill('input[name="duration"]', '60');

  await page.selectOption('select[name="mode"]', 'online');

  await page.fill('input[name="meetingLink"]', 'https://meet.google.com/test-link');
  await page.fill('input[name="capacity"]', '30');

  await page.fill(
    'textarea[name="description"]',
    'This session will cover important peer learning topics.'
  );

await page.locator('main button[type="submit"]').click();
  await expect(page.getByText(/success|created/i)).toBeVisible();
});