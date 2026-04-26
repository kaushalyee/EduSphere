import { test, expect } from '@playwright/test';

test('Peer Learning FULL FLOW (REAL)', async ({ page }) => {

  // LOGIN
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'kaushalyedilshan@gmail.com');
  await page.fill('input[type="password"]', 'Kaushalye12');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/student/dashboard');

  // GO TO PEER LEARNING
  await page.goto('http://localhost:5173/student/peer-learning');

  //  CLICK CORRECT TAB
  await page.getByText('Request a Session').click();

  // WAIT FORM LOAD
  await expect(page.getByText('Request a Kuppi Session')).toBeVisible();

  //  FILL FORM (MATCH YOUR CODE)
  await page.selectOption('select[name="category"]', { index: 1 });
  await page.selectOption('select[name="topic"]', { index: 1 });
  await page.selectOption('select[name="preferredMode"]', 'online');
  await page.selectOption('select[name="preferredTime"]', { index: 1 });

  // SUBMIT
  await page.click('button[type="submit"]');

  // CHECK SUCCESS TOAST (YOU HAVE successMessage)
  await expect(page.locator('text=success')).toBeVisible();

});