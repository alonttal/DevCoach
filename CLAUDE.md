# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run both server + client concurrently (server :3001, client :5173)
npm run dev

# Run individually
npm run dev:server    # tsx watch server/src/index.ts
npm run dev:client    # vite dev server

# Type-check
npx tsc --noEmit --project server/tsconfig.json
npx tsc --noEmit --project client/tsconfig.json

# Build
npm run build         # builds both workspaces

# Install dependencies (from root - npm workspaces)
npm install
```

No test framework is set up yet.

## Architecture

Monorepo with npm workspaces: `server/` (Express + TypeScript) and `client/` (React + Vite + TypeScript).

### Server Layers

**Routes → Controllers → Services → Repositories → JSON files**

- **Controllers** (`server/src/controllers/`) handle request/response, call services, use `getRepositories()` for data access. All follow the `(req, res, next)` pattern with try-catch forwarding to error middleware.
- **Services** (`server/src/services/`) contain business logic. `claude.service.ts` wraps the Anthropic SDK with two methods: `messageWithWebSearch()` (digest generation) and `message()` (deep dives, challenges). Domain services (`digest.service.ts`, `deepdive.service.ts`, `challenge.service.ts`) build prompts, call Claude, and parse JSON responses.
- **Repositories** use an interface-based pattern (`repositories/interfaces/`) with JSON file implementations (`repositories/json/`). `JsonFileAdapter<T>` provides atomic read/write (temp file + rename in same directory). `initRepositories(dataDir)` in `repositories/index.ts` is the single swap point for future DB migration.

### Client Layers

**Pages → Hooks → API modules → fetch wrapper**

- **API layer** (`client/src/api/`): `client.ts` provides a typed fetch wrapper (`api.get/post/put/patch/delete`). Each feature has its own API module.
- **Hooks** (`client/src/hooks/`): Custom hooks (`useProfile`, `useDigest`, `useFavorites`, `useHistory`) manage loading/error state and expose data + actions.
- **Pages** (`client/src/pages/`): Route-level components. Routed via React Router in `App.tsx`.
- **Components** (`client/src/components/`): Reusable UI. Each component has a co-located `.module.css` file.

### Key Patterns

- Types are duplicated between `server/src/types/index.ts` and `client/src/types/index.ts` — keep them in sync.
- Express v5 types require `req.params.x as string` casts for route parameters.
- Claude service prompts request raw JSON (no markdown fences), but response parsing handles fenced JSON as a fallback.
- Vite proxies `/api` to `http://localhost:3001` in dev mode.
- Data files live in `server/data/` and are gitignored.

## Environment

Requires `.env` at project root (see `.env.example`):
- `ANTHROPIC_API_KEY` — required for digest/deepdive/challenge generation
- `CLAUDE_MODEL` — defaults to `claude-sonnet-4-5-20250929`
- `PORT` — server port, defaults to 3001
- `DATA_DIR` — JSON storage path, defaults to `./data`
