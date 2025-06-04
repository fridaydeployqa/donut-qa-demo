# Donut QA Demo

[![Playwright Tests](https://github.com/fridaydeployqa/donut-qa-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/fridaydeployqa/donut-qa-demo/actions/workflows/playwright.yml)

This repository contains automated tests for the Donut website using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

- Run all tests:
```bash
npm test
```

- Run tests with UI mode:
```bash
npm run test:ui
```

- Run tests in headed mode:
```bash
npm run test:headed
```

- Debug tests:
```bash
npm run test:debug
```

## Test Structure

Tests are located in the `tests` directory. The main configuration is in `playwright.config.ts`.

## Continuous Integration

Tests are automatically run on:
- Every push to the `main` branch
- Every Pull Request targeting the `main` branch
- Manual trigger via GitHub Actions UI

Test reports are automatically uploaded as artifacts and can be accessed in the GitHub Actions run details. 