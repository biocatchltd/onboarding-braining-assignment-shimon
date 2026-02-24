# Onboarding Assignment

FastAPI server and React client for session CRUD.

## Project structure

- **server/** – FastAPI app (`app/` package: main, config, db, models, schemas)
- **client/** – React + TypeScript app (Vite, MUI, Tailwind, TanStack Query, MobX)

## Server

### Setup

Using [Poetry](https://python-poetry.org/):

```bash
poetry install
```

### Run

Start MongoDB (required for session CRUD):

```bash
docker compose up -d mongodb
```

Run the API from the project root (package `app` is installed from `server/`):

```bash
poetry run uvicorn app.main:app --reload
```

Or from `server/` so the working directory is correct:

```bash
cd server && poetry run uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000  
- Docs: http://127.0.0.1:8000/docs  

Default: `MONGO_URI=mongodb://localhost:27017`. Override if needed (e.g. in Docker: `MONGO_URI=mongodb://mongodb:27017`).

### Tests

With MongoDB running (`docker compose up -d mongodb`):

```bash
poetry run pytest server/tests -v
```

Tests use the `onboarding_test` database (set via `MONGO_DB_NAME`).

## Client

### Setup

```bash
cd client && npm install
```

### Run

With the server running on port 8000:

```bash
npm run dev
```

- App: http://localhost:5173  
- API requests are proxied from `/api` to `http://localhost:8000` (see `client/vite.config.ts`). For a different backend, set `VITE_API_BASE` (e.g. `http://localhost:8000`).

### Client tests

**Unit tests** (Vitest + React Testing Library):

```bash
cd client && npm run test:run
```

**E2E tests** (Playwright): Install browsers first (`npx playwright install`), then start MongoDB and the API. With `npm run dev` running, use `PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e`:

```bash
cd client && npx playwright install
docker compose up -d mongodb
poetry run uvicorn app.main:app --port 8000   # in another terminal
npm run test:e2e
```

## Endpoints

| Method | Path    | Description        |
|--------|---------|--------------------|
| GET    | `/`     | Welcome message    |
| GET    | `/health` | Health check     |
| GET    | `/sessions` | List sessions (paginated: `?limit=20&offset=0`, default limit 20; `?include_deleted=true` to include soft-deleted) |
| GET    | `/sessions/{id}` | Get session by ID |
| POST   | `/sessions` | Create session |
| PATCH  | `/sessions/{id}` | Update session (partial) |
| DELETE | `/sessions/{id}` | Soft delete (`?soft=false` for hard delete) |
