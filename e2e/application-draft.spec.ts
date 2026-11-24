import { expect, test } from '@playwright/test';
import { aDraft, mockApi, ProjectProposal, referenceData } from './fixtures';

test('a saved incomplete draft reads back after a reload', async ({ page }) => {
  // given
  let application = aDraft();
  await mockApi(page, {
    ...referenceData(),
    [`GET /api/v1/applications/${application.id}`]: (route) => route.fulfill({ json: application }),
    [`PUT /api/v1/applications/${application.id}/proposal`]: (route) => {
      const proposal: ProjectProposal = route.request().postDataJSON();
      application = { ...application, proposal };
      return route.fulfill({ json: application });
    },
  });
  await page.goto(`/applications/${application.id}`);
  await page.getByLabel('Projecttitel').fill('Een moestuin op het Sint-Jansplein');
  await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();
  await expect(page.getByText('Uw wijzigingen zijn opgeslagen.')).toBeVisible();

  // when
  await page.reload();

  // then
  await expect(page.getByLabel('Projecttitel')).toHaveValue('Een moestuin op het Sint-Jansplein');
  await expect(page.getByText('Nog geen bijlagen toegevoegd.')).toBeVisible();
});
