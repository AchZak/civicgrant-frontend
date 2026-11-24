import {
  aDocument,
  aDraft,
  expect,
  fundingCall,
  json,
  mockApi,
  organisation,
  proposal,
  referenceData,
  test,
} from './fixtures';

test('an applicant creates a draft, attaches a PDF, submits it and sees it submitted', async ({
  page,
}) => {
  // given
  let application = aDraft();
  await mockApi(page, {
    ...referenceData(),
    'GET /api/v1/organisations': json({ items: [organisation] }),
    'POST /api/v1/applications': (route) => route.fulfill({ status: 201, json: application }),
    [`GET /api/v1/applications/${application.id}`]: (route) => route.fulfill({ json: application }),
    [`POST /api/v1/applications/${application.id}/documents`]: (route) => {
      const document = aDocument('begroting.pdf');
      application = { ...application, documents: [document] };
      return route.fulfill({ status: 201, json: document });
    },
    [`POST /api/v1/applications/${application.id}/submission`]: (route) => {
      application = { ...application, status: 'SUBMITTED', submittedAt: '2026-11-24T11:00:00Z' };
      return route.fulfill({ status: 201, json: { submittedAt: application.submittedAt } });
    },
  });
  await page.goto(`/funding-calls/${fundingCall.id}`);

  // when
  await page.getByRole('button', { name: 'Aanvraag indienen' }).click();
  await page.getByLabel('Ondernemingsnummer').fill('0123.456.749');
  await page.getByRole('button', { name: 'Opzoeken' }).click();
  await page.getByLabel('Projecttitel').fill(proposal.title);
  await page.getByLabel('Projectbeschrijving').fill(proposal.description);
  await page.getByLabel('Gevraagd bedrag').fill('8000');
  await page.getByLabel('Totale projectbegroting').fill('12000');
  await page.getByLabel('Taal van het project').click();
  await page.getByRole('option', { name: 'Nederlands' }).click();
  await page.getByRole('button', { name: 'Opslaan als ontwerp' }).click();
  const fileChooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Een pdf toevoegen' }).click();
  await (await fileChooser).setFiles('e2e/files/begroting.pdf');
  await expect(page.getByRole('button', { name: 'begroting.pdf downloaden' })).toBeVisible();
  await page.getByRole('button', { name: 'De aanvraag indienen' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Indienen' }).click();

  // then
  await expect(page.getByText('Uw aanvraag is ingediend.', { exact: false })).toBeVisible();
  await expect(page.getByText('Ingediend', { exact: true })).toBeVisible();
});
