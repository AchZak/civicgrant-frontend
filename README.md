# CivicGrant frontend

[![CI](https://github.com/AchZak/civicgrant-frontend/actions/workflows/ci.yaml/badge.svg?branch=develop)](https://github.com/AchZak/civicgrant-frontend/actions/workflows/ci.yaml?query=branch%3Adevelop)

The Angular app of CivicGrant, a grant application portal for a (fictional) Belgian public administration. Non-profits apply to a funding call, a civil servant assesses each application, and a separate decision maker approves or rejects it with a written motivation. The domain, the rules and the decisions behind them are described in the [backend's README](https://github.com/AchZak/civicgrant-backend).

The app is in Dutch and French, and it's a thin presentation layer: the backend enforces every business rule and access rule, and the app shows what the API answers.

## Status

- [x] Scaffold: the shell with its language switch, PrimeNG and Tailwind, both languages, types generated from the API contract, CI
- [ ] Sign-in with Microsoft Entra ID, and navigation per role
- [ ] Applicant flow: funding calls, organisations, drafts, documents and submission
- [ ] Assessment and decision
- [ ] Opening a funding call
- [ ] Deployment to Azure Static Web Apps

## How it's built

Angular 22 with standalone components, signals and no zone.js. PrimeNG provides every widget and the look, through one theme preset; Tailwind is only used for layout.

The API contract in the backend repository is the single source of truth. `npm run api:types` generates the TypeScript types from it, so the app never declares an API shape by hand. The API answers with codes, never with text: statuses, legal forms and problem types are translated in the app.

Each language is its own build, with Angular's built-in i18n: Dutch under `/nl/` and French under `/fr/`. Switching language loads the other build. Every message has a fixed id, so rewording the English never loses a translation, and the build fails when a translation is missing.

One build runs in every environment. The values that differ, for now only PrimeNG's licence key, come from `/config.json`, which the app loads before it starts and the deployment writes.

### Where to look first

- [problem.ts](src/app/api/problem.ts): how an error from the API becomes a code the app can translate, with its test next to it.
- [main.ts](src/main.ts) and [runtime-config.ts](src/app/runtime-config.ts): the configuration is read and checked before Angular starts.
- [angular.json](angular.json): the two languages, each with its own base path.

## Running it locally

Requirements: Node 26, the version in `.node-version`, and the [backend](https://github.com/AchZak/civicgrant-backend) checked out next to this repository and running on port 8080. The dev server forwards `/api` to it, so there's no CORS to set up.

```bash
npm ci
cp public/config.example.json public/config.json
npm start
```

The app runs on http://localhost:4200 in Dutch. `npm run start:fr` serves the French build instead; the dev server serves one language at a time, so the language switch only works in a full build.

| What                              | Command                |
| --------------------------------- | ---------------------- |
| Lint                              | `npm run lint`         |
| Check formatting                  | `npm run format:check` |
| Unit tests                        | `npm test`             |
| Build both languages              | `npm run build`        |
| Regenerate the API types          | `npm run api:types`    |
| Extract the messages to translate | `npm run i18n:extract` |
