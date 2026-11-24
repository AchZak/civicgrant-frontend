import { Page, Route } from '@playwright/test';
import { components } from '../src/app/api/schema';

export type Application = components['schemas']['Application'];
export type FundingCall = components['schemas']['FundingCall'];
export type Organisation = components['schemas']['Organisation'];
export type ProjectProposal = components['schemas']['ProjectProposal'];
export type SupportingDocument = components['schemas']['SupportingDocument'];
type Problem = components['schemas']['InputValidationProblem'];

export const fundingCall: FundingCall = {
  id: '8a1f0c2e-1d3b-4c5a-9e7f-0a1b2c3d4e5f',
  reference: 'BUURT-2026',
  title: { nl: 'Buurtprojecten 2026', fr: 'Projets de quartier 2026' },
  opensAt: '2026-01-01T07:00:00Z',
  closesAt: '2099-12-31T22:59:59Z',
  maxAmountPerApplication: 15000,
  remainingBudget: 42500,
};

export const organisation: Organisation = {
  id: '0f1e2d3c-4b5a-4968-8776-655443322110',
  enterpriseNumber: '0123456749',
  name: 'Buurtwerk Sint-Jan vzw',
  legalForm: 'VZW_ASBL',
};

export const proposal: ProjectProposal = {
  title: 'Samen tuinieren in de wijk',
  description: 'Een gedeelde moestuin voor de buurtbewoners.',
  requestedAmount: 8000,
  totalProjectBudget: 12000,
  language: 'NL',
};

export function aDraft(changes: Partial<Application> = {}): Application {
  return {
    id: 'c0a80101-0000-4000-8000-000000000042',
    reference: 'CG-2026-000042',
    fundingCallId: fundingCall.id,
    organisationId: organisation.id,
    status: 'DRAFT',
    proposal,
    documents: [],
    createdAt: '2026-11-23T15:00:00Z',
    updatedAt: '2026-11-23T15:00:00Z',
    ...changes,
  };
}

export function aDocument(fileName: string): SupportingDocument {
  return {
    id: `document-${fileName}`,
    fileName,
    sizeInBytes: 245760,
    uploadedAt: '2026-11-24T10:00:00Z',
  };
}

export function aProblem(type: string, status: number, issues: Problem['issues'] = []): Problem {
  return { type: `urn:problem-type:${type}`, status, issues };
}

export type Handler = (route: Route) => Promise<void>;

// The app only starts with a valid /config.json; the fake session ignores the Entra values.
export async function mockApi(page: Page, handlers: Record<string, Handler>): Promise<void> {
  await page.route('**/config.json', (route) =>
    route.fulfill({
      json: {
        primeUiLicenseKey: '',
        entra: {
          tenantId: 'e2e',
          clientId: 'e2e',
          apiScope: 'api://e2e/civicgrant-api-e2e/access_as_user',
        },
      },
    }),
  );
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const key = `${request.method()} ${new URL(request.url()).pathname}`;
    const handler = handlers[key];
    if (handler) {
      await handler(route);
    } else {
      await problem(route, aProblem('belgif:resourceNotFound', 404));
    }
  });
}

export function json(body: unknown, status = 200): Handler {
  return (route) => route.fulfill({ status, json: body });
}

export function problem(route: Route, body: Problem): Promise<void> {
  return route.fulfill({
    status: body.status ?? 400,
    contentType: 'application/problem+json',
    body: JSON.stringify(body),
  });
}

export function referenceData(): Record<string, Handler> {
  return {
    [`GET /api/v1/fundingCalls/${fundingCall.id}`]: json(fundingCall),
    [`GET /api/v1/organisations/${organisation.id}`]: json(organisation),
  };
}
