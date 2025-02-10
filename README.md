# Full-Stack TypeScript Monorepo Starter

This is a comprehensive TypeScript monorepo template using Turborepo, featuring
a modern full-stack application setup.

## Getting Started

Create a new project using this template:

```sh
npx create-turbo@latest --example https://github.com/rwjblue/turbo-repo-rwjblue-kitchen-sink
```

## What's Inside?

This Turborepo includes the following packages and apps:

### Apps

- `api-server`: a [Fastify](https://fastify.io/) server
- `frontend-react`: a [Vite](https://vitejs.dev/) + React single page app
- `playwright-frontend`: E2E testing setup for the frontend

### Packages

- `@repo/db`: Database utilities and configurations
- `@repo/models`: Shared TypeScript interfaces and types
- `@repo/eslint-config`: Shared ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configurations

### Core Technologies

The entire monorepo is built with:

- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Turborepo](https://turbo.build/repo) for monorepo management
- [Vite](https://vitejs.dev/) for frontend development
- [Fastify](https://fastify.io/) for backend API
- [Vitest](https://vitest.dev/) for unit testing
- [Playwright](https://playwright.dev/) for E2E testing

### Development Tools

This template comes preconfigured with:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Vitest](https://vitest.dev) for unit testing
- [Playwright](https://playwright.dev) for end-to-end testing

## Available Scripts

- `build`: Build all apps and packages
- `dev`: Start development servers
- `lint`: Run ESLint
- `lint:fix`: Fix ESLint issues
- `test`: Run unit tests
- `test:ci`: Run tests in CI mode
- `e2e`: Run end-to-end tests
