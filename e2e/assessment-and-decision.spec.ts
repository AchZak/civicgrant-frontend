import {
  aPageOf,
  aProblem,
  anApprovalAssessment,
  Application,
  Assessment,
  aSubmittedApplication,
  aSummaryOf,
  Decision,
  expect,
  json,
  mockApi,
  problem,
  referenceData,
  signedInAs,
  test,
} from './fixtures';

const notFound = aProblem('belgif:resourceNotFound', 404);

test('an assessor records an assessment and sees the application assessed', async ({ page }) => {
  // given
  let application = aSubmittedApplication();
  let assessment: Assessment | undefined;
  await mockApi(page, {
    ...signedInAs('ASSESSOR'),
    ...referenceData(),
    [`GET /api/v1/applications/${application.id}`]: (route) => route.fulfill({ json: application }),
    [`GET /api/v1/applications/${application.id}/assessment`]: (route) =>
      assessment ? route.fulfill({ json: assessment }) : problem(route, notFound),
    [`POST /api/v1/applications/${application.id}/assessment`]: (route) => {
      assessment = { ...anApprovalAssessment(), ...route.request().postDataJSON() };
      application = { ...application, status: 'ASSESSED' };
      return route.fulfill({ status: 201, json: assessment });
    },
  });
  await page.goto(`/applications/${application.id}`);

  // when
  await page.getByRole('group', { name: 'Komt in aanmerking' }).getByLabel('Ja').check();
  await page.getByRole('group', { name: 'Advies' }).getByLabel('Goedkeuren').check();
  await page.getByLabel('Voorgesteld bedrag').fill('7500');
  await page.getByLabel('Toelichting').fill('Sterk buurtproject met een realistische begroting.');
  await page.getByRole('button', { name: 'Beoordeling registreren' }).click();

  // then
  await expect(page.getByText('Beoordeeld', { exact: true })).toBeVisible();
  await expect(page.getByText('Sterk buurtproject met een realistische begroting.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Beoordeling registreren' })).toBeHidden();
});

test('a decision maker approves with a motivation and the list shows it approved', async ({
  page,
}) => {
  // given
  let application: Application = aSubmittedApplication({ status: 'ASSESSED' });
  let decision: Decision | undefined;
  await mockApi(page, {
    ...signedInAs('DECISION_MAKER'),
    ...referenceData(),
    'GET /api/v1/applications': (route) =>
      route.fulfill({ json: aPageOf(aSummaryOf(application)) }),
    [`GET /api/v1/applications/${application.id}`]: (route) => route.fulfill({ json: application }),
    [`GET /api/v1/applications/${application.id}/assessment`]: json(anApprovalAssessment()),
    [`GET /api/v1/applications/${application.id}/decision`]: (route) =>
      decision ? route.fulfill({ json: decision }) : problem(route, notFound),
    [`POST /api/v1/applications/${application.id}/decision`]: (route) => {
      decision = { ...route.request().postDataJSON(), decidedAt: '2026-11-24T16:00:00Z' };
      application = { ...application, status: 'APPROVED' };
      return route.fulfill({ status: 201, json: decision });
    },
  });
  await page.goto(`/applications/${application.id}`);

  // when
  await page.getByRole('group', { name: 'Uw beslissing' }).getByLabel('Goedkeuren').check();
  await expect(page.getByLabel('Toegekend bedrag')).toHaveValue(/7\.500,00/);
  await page.getByLabel('Motivering').fill('Het project versterkt de buurt.');
  await page.getByRole('button', { name: 'Beslissing registreren' }).click();
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: 'Beslissing registreren' })
    .click();
  await expect(page.getByText('Het project versterkt de buurt.')).toBeVisible();
  await page.getByRole('link', { name: 'Aanvragen', exact: true }).click();

  // then
  await expect(page.getByRole('row', { name: application.reference })).toContainText('Goedgekeurd');
});
