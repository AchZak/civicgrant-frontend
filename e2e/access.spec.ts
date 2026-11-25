import {
  aPageOf,
  expect,
  fundingCall,
  json,
  mockApi,
  referenceData,
  signedInAs,
  test,
} from './fixtures';

test('an applicant lands on their own applications', async ({ page }) => {
  // given
  await mockApi(page, {
    ...signedInAs('APPLICANT'),
    'GET /api/v1/applications': json(aPageOf()),
  });

  // when
  await page.goto('/');

  // then
  await expect(page.getByRole('heading', { name: 'Mijn aanvragen' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nieuwe aanvraag' })).toBeVisible();
});

test('an assessor lands on the submitted applications', async ({ page }) => {
  // given
  await mockApi(page, {
    ...signedInAs('ASSESSOR'),
    'GET /api/v1/applications': json(aPageOf()),
  });

  // when
  await page.goto('/');

  // then
  await expect(page.getByRole('heading', { name: 'Aanvragen', exact: true })).toBeVisible();
  await expect(page.getByText('Er zijn nog geen ingediende aanvragen.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nieuwe aanvraag' })).toBeHidden();
});

test('a programme manager lands on the open funding calls', async ({ page }) => {
  // given
  await mockApi(page, {
    ...signedInAs('PROGRAMME_MANAGER'),
    'GET /api/v1/fundingCalls': json({ items: [fundingCall] }),
  });

  // when
  await page.goto('/');

  // then
  await expect(page.getByRole('heading', { name: 'Open projectoproepen' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Een projectoproep openen' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buurtprojecten 2026' })).toBeVisible();
});

test('an assessor who opens a page for applicants is refused', async ({ page }) => {
  // given
  await mockApi(page, { ...signedInAs('ASSESSOR'), ...referenceData() });

  // when
  await page.goto(`/applications/new?fundingCallId=${fundingCall.id}`);

  // then
  await expect(page.getByRole('heading', { name: 'Geen toegang' })).toBeVisible();
  await expect(page).toHaveURL(/\/applications\/new/);
});
