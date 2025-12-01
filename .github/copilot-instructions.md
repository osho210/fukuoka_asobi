# Copilot Coding Agent Instructions

## Repository Overview

**福岡遊び日記 (Fukuoka Asobi)** is a web application for discovering places to visit in Fukuoka, Japan. Users can explore various categories (cafés, restaurants, activities, etc.) and create/share plans. The project follows a monorepo structure with npm workspaces.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15.x (App Router), TypeScript 5.x, React 19.x |
| Admin | Next.js 15.x (App Router), TypeScript 5.x, React 19.x |
| Backend | Ruby on Rails 8.0.1, Ruby 3.3.1, GraphQL |
| State Management | Apollo Client 3.13.x |
| Database | MySQL 8.0 (dev), PostgreSQL (prod) |
| Testing | RSpec (backend), Vitest (frontend), Storybook |
| Linting | RuboCop (backend), ESLint (frontend/admin) |

## Project Structure

```
fukuoka-asobi/
├── package.json              # Root workspace config (npm workspaces)
├── frontend/                 # User-facing Next.js app (port 8200)
│   ├── src/app/              # App Router pages
│   ├── src/components/       # React components
│   ├── src/graphql/          # GraphQL queries/mutations
│   └── src/__generated__/    # Auto-generated GraphQL types
├── admin/                    # Admin Next.js app (port 9200)
│   ├── src/app/              # App Router pages
│   ├── src/components/       # UI components (Radix UI)
│   └── src/__generated__/    # Auto-generated GraphQL types
├── backend/                  # Rails API (port 3000)
│   ├── app/graphql/          # GraphQL schema, types, mutations, resolvers
│   ├── app/models/           # ActiveRecord models
│   ├── app/services/         # Service classes
│   ├── spec/                 # RSpec tests
│   └── .rubocop.yml          # RuboCop config
├── docs/                     # Design documents
└── docker-compose.yml        # Development environment
```

## Build & Development Commands

### Initial Setup (Always run first)

```bash
# From repository root - installs all workspace dependencies
npm install
```

### Frontend (User App)

```bash
npm run dev:frontend      # Start dev server (port 8200)
npm run build:frontend    # Build for production
npm run lint:frontend     # Run ESLint
cd frontend && npm run generate  # Generate GraphQL types (requires backend running)
```

### Admin App

```bash
npm run dev:admin         # Start dev server (port 9200)
npm run build:admin       # Build for production
npm run lint:admin        # Run ESLint
cd admin && npm run generate     # Generate GraphQL types (requires backend running)
```

### Backend (Rails)

```bash
# Run with Docker (recommended)
docker-compose up -d

# Or run locally (requires MySQL, Ruby 3.3.1)
cd backend
bundle install
bin/rails db:migrate
bin/rails server -p 3000

# Testing (CI uses: bin/rails db:test:prepare test test:system)
bin/rails db:test:prepare                # Prepare test database
bin/rails test                           # Run unit/integration tests
bin/rails test:system                    # Run system tests
bin/rails db:test:prepare test test:system  # Full CI-equivalent test run
bundle exec rspec                        # Run RSpec tests (alternative)

# Linting & Security
bin/rubocop                              # Lint Ruby code
bin/brakeman --no-pager                  # Security scan
bin/importmap audit                      # JS dependency audit
```

### Storybook

```bash
npm run storybook:frontend       # Frontend Storybook (port 6006)
npm run storybook:admin          # Admin Storybook (port 6007)
npm run build-storybook:frontend # Build frontend Storybook
npm run build-storybook:admin    # Build admin Storybook
```

## CI/CD Workflows

### GitHub Actions

1. **Chromatic (`.github/workflows/chromatic.yml`)**: Runs on PR and push to main
   - Builds Storybook for frontend and admin
   - Runs visual regression tests

2. **Backend CI (`backend/.github/workflows/ci.yml`)**: Runs on PR and push to main
   - `scan_ruby`: Security scan with Brakeman
   - `scan_js`: JavaScript dependency audit with importmap
   - `lint`: RuboCop linting
   - `test`: Rails tests with SQLite (`bin/rails db:test:prepare test test:system`)

### Pre-commit Validation

Before submitting changes, always run:

```bash
# Frontend/Admin changes
npm run lint:frontend
npm run lint:admin

# Backend changes
cd backend
bin/rubocop -a                               # Auto-fix linting issues
bin/brakeman --no-pager                      # Security check
bin/rails db:test:prepare test test:system   # Run all tests (same as CI)
```

## GraphQL Development

**CRITICAL**: This project uses GraphQL Code Generator. Never manually define types for GraphQL queries/mutations.

```bash
# Regenerate types after schema changes (backend must be running on port 3000)
cd frontend && npm run generate
cd admin && npm run generate
```

- Generated types location: `src/__generated__/`
- Import types from: `@/__generated__/types` or `@/__generated__/graphql`
- GraphQL endpoint: `http://localhost:3000/graphql`
- GraphiQL UI (dev only): `http://localhost:3000/graphiql`

## Key Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Root npm workspaces config |
| `.commitlintrc.js` | Commit message conventions |
| `frontend/codegen.ts` | GraphQL Code Generator config |
| `admin/codegen.ts` | GraphQL Code Generator config |
| `backend/.rubocop.yml` | Ruby linting rules |
| `backend/.ruby-version` | Ruby version (3.3.1) |
| `docker-compose.yml` | Development services (MySQL, MinIO, Rails) |

## Commit Message Convention

Use the `npm run commit` command or follow this format:

```
[type]: description

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, graphql, setting
```

## Troubleshooting

### npm install fails

```bash
rm -rf node_modules package-lock.json frontend/node_modules admin/node_modules
npm install
```

### Docker bundle cache issues

```bash
docker volume ls | grep bundle
docker volume rm fukuoka-asobi_bundle_cache
docker-compose up --build
```

### GraphQL type generation fails

Ensure the backend is running on port 3000 before running `npm run generate`.

### Frontend build fails with font errors

The build may fail in environments without internet access due to Google Fonts. This is expected in isolated environments; the CI will work correctly.

## Important Notes

1. **Always run `npm install` from the root** - Never run it from individual workspaces
2. **GraphQL types are auto-generated** - Do not manually define types for GraphQL operations
3. **ESLint ignores `__generated__/` directories** - These are auto-generated files
4. **Backend uses SQLite for tests** - MySQL for development, PostgreSQL for production
5. **Trust these instructions** - Only search the codebase if information here is incomplete or incorrect
