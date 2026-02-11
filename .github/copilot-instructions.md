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
npm run chromatic:frontend       # Run Chromatic visual tests for frontend
npm run chromatic:admin          # Run Chromatic visual tests for admin
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

3. **Backend Deploy (`.github/workflows/deploy-backend.yml`)**: Manual deployment workflow
   - Triggered via `workflow_dispatch` with version input
   - Deploys backend to VPS using Kamal
   - Requires secrets for DB, MinIO, Cloudflare R2, SSH access
   - Sets up Docker, GHCR authentication, and Kamal deployment

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

## Code Review Guidelines (Code Review は日本語で記述)

**All code review comments must be written in Japanese.** Here are guidelines for effective reviews:

### Good Examples (良い例)

```markdown
- このコンポーネントの責任が大きすぎます。分割を検討してください
- GraphQL のクエリをメモ化することでパフォーマンスが向上します
- このテーブルの N+1 問題を解決するために eager_load を使用しましょう
- 「福岡市内のスポットのみをフィルタリング」という意図が明確になります
```

### Avoid (避けるべき例)

```markdown
- "this is inefficient" (英語のみ)
- "missing types" (英語のみ)
- "refactor this" (曖昧)
```

### Documentation & Comments

- All README, design documents, and comments: Japanese
- Code comments: Japanese
- Variable/function/class names: English

## Coding Standards by Layer

### Backend (Ruby on Rails)

```ruby
# ✅ Follow RuboCop rules (auto-formatted on save)
# ✅ Use Google-style Docstrings in Japanese

class SpotService
  # スポットのお気に入り判定を実行します。
  #
  # Args:
  #   user_id (Integer): ユーザーID
  #   spot_id (Integer): スポットID
  #
  # Returns:
  #   Boolean: お気に入り登録されている場合は true
  def is_favorite?(user_id, spot_id)
    Favorite.exists?(user_id: user_id, spot_id: spot_id)
  end
end
```

### Frontend (TypeScript)

```typescript
// ✅ ESLint + Prettier compliant
// ✅ TypeScript strict mode enabled
// ✅ Component naming: PascalCase
// ✅ Function/variable naming: camelCase

interface SpotCardProps {
  spotName: string;
  address: string;
  imageUrl?: string;
}

export function SpotCard({ spotName, address, imageUrl }: SpotCardProps) {
  // 福岡市内のスポットのみをフィルタリング
  return (
    <div className="spot-card">
      {imageUrl && <img src={imageUrl} alt={spotName} />}
      <h3>{spotName}</h3>
      <p>{address}</p>
    </div>
  );
}
```

## Testing Requirements

### Backend (RSpec)

- Location: `spec/models/`, `spec/services/`, `spec/graphql/`
- Coverage target: 80%+
- Command: `bundle exec rspec` or `bin/rails db:test:prepare test`

### Frontend (Vitest)

- Component tests: `src/components/tests/[ComponentName].test.tsx`
- Utility tests: `src/lib/tests/[utilityName].test.ts`
- Coverage target: 80%+
- Commands:
  ```bash
  npm test -w frontend
  npm test -- --watch -w frontend              # Watch mode
  npm test -- --coverage -w frontend           # Coverage report
  ```

## Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User info (Google OAuth) |
| `spots` | Places (cafés, restaurants, activities) |
| `play_plans` | User-created plans |
| `plan_details` | Steps within a plan |
| `events` | Events and activities |
| `news` | Articles and news |
| `bookmarks` | User bookmarks |
| `favorites` | User favorites |

See `.clinerules` for complete DB schema.

## Common Commands Quick Reference

### Dependency Management

```bash
# Add to all workspaces (root)
npm install <package-name>

# Add to specific workspace
npm install <package-name> -w frontend
npm install <package-name> -w admin
npm install -D <package-name> -w frontend    # Dev dependency
```

### GraphQL & Type Generation

```bash
# Requires backend running on port 3000
cd frontend && npm run generate
cd admin && npm run generate

# Clear cache and regenerate
rm -rf frontend/src/__generated__
npm run generate -w frontend
```

### Testing

```bash
# Backend
cd backend
bin/rails db:test:prepare test test:system
bundle exec rspec

# Frontend
npm test -w frontend
npm test -- --watch -w frontend
npm test -- --coverage -w frontend
```

### Development Servers

```bash
npm run dev:frontend    # Port 8200
npm run dev:admin       # Port 9200
cd backend && rails server  # Port 3000
```

### Linting & Formatting

```bash
# Frontend/Admin
npm run lint:frontend
npm run lint:admin

# Backend
cd backend
bin/rubocop -a         # Auto-fix issues
bin/brakeman --no-pager  # Security scan
```

### Storybook

```bash
npm run storybook:frontend    # Port 6006
npm run storybook:admin       # Port 6007
npm run build-storybook:frontend
npm run build-storybook:admin
npm run chromatic:frontend    # Visual regression tests
npm run chromatic:admin       # Visual regression tests
```

### Docker Operations

```bash
# Start all services
docker-compose up -d

# Access backend container
docker exec -it fukuoka_asobi_backend bash

# Clear bundle cache
docker volume rm fukuoka-asobi_bundle_cache
docker-compose up --build
```

## PR Review Checklist

### Backend (Rails)

- [ ] GraphQL types have Japanese Docstrings
- [ ] RuboCop checks pass
- [ ] Test coverage ≥ 80%
- [ ] No N+1 query issues
- [ ] Proper validations implemented
- [ ] All review comments in Japanese

### Frontend/Admin (Next.js)

- [ ] All TypeScript types defined
- [ ] Using auto-generated GraphQL types (no manual types)
- [ ] Components follow Single Responsibility Principle
- [ ] ESLint passes
- [ ] Tests added for changes
- [ ] All review comments in Japanese

### General

- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] Design documents updated (for major changes)

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

### TypeScript cache issues

```bash
# Clear TypeScript cache
rm -rf node_modules/.typescript
npm install

# Or restart TS server in VSCode
# Cmd+Shift+P > TypeScript: Restart TS Server
```

### Port conflicts

```bash
# Check port usage
lsof -i :8200   # Frontend
lsof -i :9200   # Admin
lsof -i :3000   # Backend

# Kill process using port
kill -9 <PID>
```

## Important Notes

1. **Always run `npm install` from the root** - Never run it from individual workspaces
2. **GraphQL types are auto-generated** - Do not manually define types for GraphQL operations
3. **ESLint ignores `__generated__/` directories** - These are auto-generated files
4. **Backend uses SQLite for tests** - MySQL for development, PostgreSQL for production
5. **Review comments must be in Japanese** - Maintain consistency across the team
6. **Trust these instructions** - Only search the codebase if information here is incomplete or incorrect

## Resources

- [GraphQL Code Generator Guide](../docs/GRAPHQL_CODEGEN.md)
- [npm Workspaces Guide](../docs/workspace_guide.md)
- [Design Documents](../docs/design.md)
- [Cline Rules](./../.clinerules) - Detailed guidelines for Cline AI
- [Copilot Instructions](../copilot-instructions.md) - GitHub Copilot guidelines
