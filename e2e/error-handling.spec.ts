import { aDraft, aProblem, expect, mockApi, problem, referenceData, test } from './fixtures';

const application = aDraft();
const proposalUrl = `PUT /api/v1/applications/${application.id}/proposal`;

test('a 400 with input issues shows next to its field and keeps what the user typed', async ({
  page,
}) => {
  // given
  await mockApi(page, {
    ...referenceData(),
    [`GET /api/v1/applications/${application.id}`]: (route) => route.fulfill({ json: application }),
    [proposalUrl]: (route) =>
      problem(
        route,
        aProblem('belgif:badRequest', 400, [
          {
            type: 'urn:problem-type:belgif:input-validation:schemaViolation',
            in: 'body',
            name: '/title',
          },
        ]),
      ),
  });
  await page.goto(`/applications/${application.id}`);
  await page.getByLabel('Projecttitel').fill('Een titel die de server weigert');

  // when
  await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();

  // then
  const title = page.getByLabel('Projecttitel');
  await expect(title).toHaveAccessibleDescription('Deze waarde is niet geldig.');
  await expect(title).toHaveValue('Een titel die de server weigert');
});

test('a concurrent update asks to reload and then shows the stored version', async ({ page }) => {
  // given
  await mockApi(page, {
    ...referenceData(),
    [`GET /api/v1/applications/${application.id}`]: (route) => route.fulfill({ json: application }),
    [proposalUrl]: (route) => problem(route, aProblem('civicgrant:concurrentUpdate', 409)),
  });
  await page.goto(`/applications/${application.id}`);
  await page.getByLabel('Projecttitel').fill('Mijn versie van de titel');
  await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();
  await expect(
    page.getByText('Iemand anders heeft dit tegelijk gewijzigd.', { exact: false }),
  ).toBeVisible();

  // when
  await page.getByRole('button', { name: 'De aanvraag opnieuw laden' }).click();

  // then
  await expect(page.getByLabel('Projecttitel')).toHaveValue(application.proposal.title);
});
