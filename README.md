# CivicGrant frontend

[![CI](https://github.com/AchZak/civicgrant-frontend/actions/workflows/ci.yaml/badge.svg?branch=develop)](https://github.com/AchZak/civicgrant-frontend/actions/workflows/ci.yaml?query=branch%3Adevelop)

The Angular app of CivicGrant, a grant application portal for a (fictional) Belgian public administration. Non-profits apply to a funding call, a civil servant assesses each application, and a separate decision maker approves or rejects it with a written motivation. The domain, the rules and the decisions behind them are described in the [backend's README](https://github.com/AchZak/civicgrant-backend).

The app is in Dutch and French, and it's a thin presentation layer: the backend enforces every business rule and access rule, and the app shows what the API answers.

## Status

- [x] Scaffold: the shell with its language switch, PrimeNG and Tailwind, both languages, types generated from the API contract, CI
- [x] Sign-in with Microsoft Entra ID (the app's side; its Entra registration isn't deployed yet)
- [ ] Navigation per role
- [x] Applicant flow: funding calls, organisations, drafts, documents and submission
- [ ] Assessment and decision
- [ ] Opening a funding call
- [ ] Deployment to Azure Static Web Apps

## How it's built

Angular 22 with standalone components, signals and no zone.js. PrimeNG provides every widget and the look, through one theme preset; Tailwind is only used for layout.

The API contract in the backend repository is the single source of truth. `npm run api:types` generates the TypeScript types from it, so the app never declares an API shape by hand. Pages read through `httpResource`, and each feature has one file that knows its URLs. Writes go through a small service per feature and return promises, so components never subscribe to anything.

The API answers with codes, never with text. Statuses, legal forms, rejection grounds and problem types are translated in the app, one list per kind, and an unknown code falls back to a generic message, so a new code in the backend never breaks a page. When the backend refuses a form, the problem's input issues and field-specific codes appear next to the field concerned, and everything else above the form. A change made by someone else at the same time gives a 409, and the page offers to reload.

Forms use Angular's Signal Forms with PrimeNG's inputs. The only rules checked in the browser are the ones the contract states (required fields, maximum lengths, the funding call's maximum amount), so the user sees them early; the backend still decides.

Each language is its own build, with Angular's built-in i18n: Dutch under `/nl/` and French under `/fr/`. Switching language loads the other build. Every message has a fixed id, so rewording the English never loses a translation, the build fails when a translation is missing, and a lint rule fails when a template has text that isn't marked for translation.

Sign-in uses Microsoft Entra ID with MSAL, before Angular starts: the app either runs with a signed-in user or redirects to sign in. An interceptor adds the access token to API calls only.

One build runs in every environment. The values that differ, the Entra registration and PrimeNG's licence key, come from `/config.json`, which the app loads before it starts and the deployment writes.

### Tests

The backend tests every business rule and access rule, so the frontend keeps its tests few. Unit tests cover the two pieces of logic the compiler can't check: reading an error from the API and parsing enterprise numbers. Playwright covers the journeys a user takes, against the Dutch build, with the API mocked and a fake signed-in user swapped in by a build configuration, so the production code has no test switch.

### Where to look first

- [problem.ts](src/app/api/problem.ts) and [server-errors.ts](src/app/shared/server-errors.ts): how an error from the API becomes a translated message on the right field.
- [application-detail.ts](src/app/applications/application-detail/application-detail.ts): a page built from resources, with a draft form that reloads after a save and recovers from a concurrent change.
- [start-session.ts](src/app/auth/start-session.ts) and [start-session.e2e.ts](src/app/auth/start-session.e2e.ts): the sign-in, and the fake user the journeys run with.
- [error-handling.spec.ts](e2e/error-handling.spec.ts): a refused form and a concurrent change, tested the way a user sees them.

## Running it locally

Requirements: Node 26, the version in `.node-version`, and the [backend](https://github.com/AchZak/civicgrant-backend) checked out next to this repository and running on port 8080. The dev server forwards `/api` to it, so there's no CORS to set up.

```bash
npm ci
cp public/config.example.json public/config.json
npm start
```

Fill in `public/config.json` with the Entra values of a SPA registration first; the app signs in before it shows anything. `npm run start:e2e` runs the same app with a fake signed-in user instead, which is what the journeys use.

The app runs on http://localhost:4200 in Dutch. `npm run start:fr` serves the French build instead; the dev server serves one language at a time, so the language switch only works in a full build.

| What                              | Command                |
| --------------------------------- | ---------------------- |
| Lint                              | `npm run lint`         |
| Check formatting                  | `npm run format:check` |
| Unit tests                        | `npm test`             |
| Playwright journeys               | `npm run e2e`          |
| Build both languages              | `npm run build`        |
| Regenerate the API types          | `npm run api:types`    |
| Extract the messages to translate | `npm run i18n:extract` |
