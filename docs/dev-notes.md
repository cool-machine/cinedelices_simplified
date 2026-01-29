# Ciné Délices — Development Notes

> Document reflecting the **actual** state of the project as it exists in this repository.

---

## ✅ Summary

Svelte SPA (frontend) + Express REST API (backend) + PostgreSQL/Sequelize. JWT auth via httpOnly cookies (Bearer compatible). Admin back-office on frontend and administration endpoints on backend. TMDB integration + recipe generation via **Mistral**.

---

## 🏃 Sprints (Completed)

### Sprint 0 — Design
- Requirements defined in [docs/requirements/CinéDélices.md](docs/requirements/CinéDélices.md):
    - MVP: catalog (search + filters), recipe page (ingredients/instructions/anecdote), auth, add recipe, back-office.
    - Constraints: security, API consumption, responsive, accessibility, GDPR, SEO, versioning, deployment.
- Wireframes completed.
- Mockups completed.
- MCD (Conceptual Data Model) defined.
- MLD (Logical Data Model) defined.
- MPD (Physical Data Model) defined.

### Sprint 1 — Setup (Technical Foundation)
- Express backend operational + main routing (entry [backend/server.js](backend/server.js), app [backend/src/app.js](backend/src/app.js), router [backend/src/routes/index.js](backend/src/routes/index.js)).
- Sequelize models + migrations/seeders (models [backend/src/models](backend/src/models), migrations [backend/src/migrations](backend/src/migrations), seeders [backend/src/seeders](backend/src/seeders)).
- Svelte SPA frontend initialized + routing (bootstrap [frontend/src/main.js](frontend/src/main.js), app [frontend/src/App.svelte](frontend/src/App.svelte), routes [frontend/src/routes.js](frontend/src/routes.js)).
- Docker dev/prod in place ([docker-compose.dev.yml](docker-compose.dev.yml), [docker-compose.yml](docker-compose.yml), backend [backend/Dockerfile](backend/Dockerfile), frontend [frontend/Dockerfile](frontend/Dockerfile)).

### Sprint 2 — MVP Feature Development
- JWT authentication + profiles (controllers [backend/src/controllers/authController.js](backend/src/controllers/authController.js), middleware [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js), pages [frontend/src/pages/Login.svelte](frontend/src/pages/Login.svelte), [frontend/src/pages/Register.svelte](frontend/src/pages/Register.svelte), [frontend/src/pages/Profile.svelte](frontend/src/pages/Profile.svelte), [frontend/src/pages/ProfileEdit.svelte](frontend/src/pages/ProfileEdit.svelte)).
- Recipe CRUD + ownership rules (backend [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), routes [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js), frontend [frontend/src/pages/Recipes.svelte](frontend/src/pages/Recipes.svelte), [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte), [frontend/src/pages/RecipeEdit.svelte](frontend/src/pages/RecipeEdit.svelte), [frontend/src/pages/RecipeDetail.svelte](frontend/src/pages/RecipeDetail.svelte)).
- Admin back-office (API + UI) (routes [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js), pages [frontend/src/pages/admin/Dashboard.svelte](frontend/src/pages/admin/Dashboard.svelte), [frontend/src/pages/admin/Recipes.svelte](frontend/src/pages/admin/Recipes.svelte), [frontend/src/pages/admin/Categories.svelte](frontend/src/pages/admin/Categories.svelte), [frontend/src/pages/admin/Media.svelte](frontend/src/pages/admin/Media.svelte), [frontend/src/pages/admin/Users.svelte](frontend/src/pages/admin/Users.svelte)).
- Categories/media metadata (backend [backend/src/controllers/metadataController.js](backend/src/controllers/metadataController.js), routes [backend/src/routes/index.js](backend/src/routes/index.js)).

### Sprint 3 — Finalization, Tests & Integrations
- TMDB integration (service [backend/src/services/tmdbService.js](backend/src/services/tmdbService.js), routes [backend/src/routes/tmdbRoutes.js](backend/src/routes/tmdbRoutes.js), page [frontend/src/pages/Movies.svelte](frontend/src/pages/Movies.svelte)).
- Mistral recipe generation (service [backend/src/services/mistralService.js](backend/src/services/mistralService.js), endpoint [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js), UI [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte)).
- Unit & integration tests (tests [backend/tests](backend/tests), config [backend/jest.config.js](backend/jest.config.js)).
- API ops: healthcheck + proper 404 (app [backend/src/app.js](backend/src/app.js#L66-L75)).

---

## 🧱 Tech Stack (with locations)

### Frontend
- Svelte 5 + Vite (bootstrap [frontend/src/main.js](frontend/src/main.js#L1-L9), root [frontend/src/App.svelte](frontend/src/App.svelte))
- SPA Router: svelte-spa-router (routes [frontend/src/routes.js](frontend/src/routes.js), usage [frontend/src/App.svelte](frontend/src/App.svelte#L1-L21))

### Backend
- Node.js 20 + Express 5 (entry [backend/server.js](backend/server.js), app [backend/src/app.js](backend/src/app.js#L1-L120))
- Sequelize + PostgreSQL (models [backend/src/models](backend/src/models), config [backend/src/config/config.js](backend/src/config/config.js))
- Auth: JWT (httpOnly cookie + Bearer) (utils [backend/src/utils/jwt.js](backend/src/utils/jwt.js), auth flow [backend/src/controllers/authController.js](backend/src/controllers/authController.js), middleware [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js))
- Security: Helmet, rate limiting, CORS, cookie-parser (middlewares [backend/src/app.js](backend/src/app.js#L1-L90))
- Validation: express-validator (schemas [backend/src/validations/recipeSchema.js](backend/src/validations/recipeSchema.js), routes [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js))

### Tooling
- Tests: Jest + Supertest (tests [backend/tests](backend/tests), config [backend/jest.config.js](backend/jest.config.js))
- Lint: ESLint (config [backend/eslint.config.js](backend/eslint.config.js))
- Docker: docker-compose (dev + prod) ([docker-compose.dev.yml](docker-compose.dev.yml), [docker-compose.yml](docker-compose.yml))

---

## 🧬 Data Model (Sequelize tables)

### users
- id, email, password_hash, username, role, avatar_url, bio, created_at, updated_at

### categories
- id, name, description, created_at, updated_at

### media
- id, title, type (film|serie), image_url, release_year, created_at, updated_at

### recipes
- id, title, description, ingredients (text), instructions (text), anecdote,
  difficulty (easy|medium|hard), prep_time, cook_time, image_url,
  user_id, category_id, media_id, created_at, updated_at

---

## ✅ Implemented Features (with locations)

### Auth & Profiles
- Register / login / logout (backend: [backend/src/controllers/authController.js](backend/src/controllers/authController.js), [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js); frontend: [frontend/src/pages/Login.svelte](frontend/src/pages/Login.svelte), [frontend/src/pages/Register.svelte](frontend/src/pages/Register.svelte), [frontend/src/lib/api.js](frontend/src/lib/api.js))
- JWT in httpOnly cookie (+ Bearer support) (backend: [backend/src/utils/jwt.js](backend/src/utils/jwt.js), [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js), cookie set in [backend/src/controllers/authController.js](backend/src/controllers/authController.js))
- User profile + edit (bio, avatar, email, password) (backend: [backend/src/controllers/userController.js](backend/src/controllers/userController.js), [backend/src/routes/userRoutes.js](backend/src/routes/userRoutes.js); frontend: [frontend/src/pages/Profile.svelte](frontend/src/pages/Profile.svelte), [frontend/src/pages/ProfileEdit.svelte](frontend/src/pages/ProfileEdit.svelte))
- Admin access via user/admin role (backend: [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js), [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js); frontend: [frontend/src/pages/admin/Dashboard.svelte](frontend/src/pages/admin/Dashboard.svelte))

### Recipes
- Recipe CRUD (create/read/update/delete) (backend: [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js); frontend: [frontend/src/pages/Recipes.svelte](frontend/src/pages/Recipes.svelte), [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte), [frontend/src/pages/RecipeEdit.svelte](frontend/src/pages/RecipeEdit.svelte))
- Ownership rules (author or admin) (backend: [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js); frontend: [frontend/src/pages/RecipeEdit.svelte](frontend/src/pages/RecipeEdit.svelte))
- Recipe detail with associated media (backend: [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js); frontend: [frontend/src/pages/RecipeDetail.svelte](frontend/src/pages/RecipeDetail.svelte))

### Metadata
- Categories (list) (backend: [backend/src/controllers/metadataController.js](backend/src/controllers/metadataController.js), [backend/src/routes/index.js](backend/src/routes/index.js); frontend: [frontend/src/pages/Recipes.svelte](frontend/src/pages/Recipes.svelte))
- Media (list + API creation) (backend: [backend/src/controllers/metadataController.js](backend/src/controllers/metadataController.js), [backend/src/routes/index.js](backend/src/routes/index.js); frontend: [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte))

### Back-office (API + UI)
- Global statistics (backend: [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js); frontend: [frontend/src/pages/admin/Dashboard.svelte](frontend/src/pages/admin/Dashboard.svelte))
- Manage recipes, categories, media, users (backend: [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js); frontend: [frontend/src/pages/admin/Recipes.svelte](frontend/src/pages/admin/Recipes.svelte), [frontend/src/pages/admin/Categories.svelte](frontend/src/pages/admin/Categories.svelte), [frontend/src/pages/admin/Media.svelte](frontend/src/pages/admin/Media.svelte), [frontend/src/pages/admin/Users.svelte](frontend/src/pages/admin/Users.svelte))

### TMDB
- Movie/TV search (backend: [backend/src/routes/tmdbRoutes.js](backend/src/routes/tmdbRoutes.js), [backend/src/services/tmdbService.js](backend/src/services/tmdbService.js); frontend: [frontend/src/pages/Movies.svelte](frontend/src/pages/Movies.svelte))
- TMDB details (backend: [backend/src/routes/tmdbRoutes.js](backend/src/routes/tmdbRoutes.js), [backend/src/services/tmdbService.js](backend/src/services/tmdbService.js))
- Pre-fill from TMDB for recipe creation (frontend: [frontend/src/pages/Movies.svelte](frontend/src/pages/Movies.svelte), [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte))

### AI (Mistral)
- Recipe generation endpoint from movie/TV show (backend: [backend/src/services/mistralService.js](backend/src/services/mistralService.js), [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js); frontend: [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte))
- Enabled if MISTRAL_API_KEY is configured (backend: [backend/src/services/mistralService.js](backend/src/services/mistralService.js))

### Ops
- Health check: /health (backend: [backend/src/app.js](backend/src/app.js#L66-L69))
- Proper API 404 (backend: [backend/src/app.js](backend/src/app.js#L72-L75))

---

## 🧭 Frontend Routes (SPA)

- / (Home)
- /movies (TMDB search)
- /recipes (catalog + client-side filters)
- /recipes/:id (detail)
- /recipes/new (create, with AI option)
- /recipes/:id/edit (edit)
- /login, /register
- /profile/:id, /profile/edit
- /admin + admin sections (recipes, categories, media, users)
- /legal, /privacy, /about, /contact
- /not-found (catch-all)

---

## 🧪 Existing Tests

- Unit: JWT utils, recipeController
- Integration: TMDB routes

---

## 🔧 Environment Variables

Backend:
- DATABASE_URL
- SESSION_SECRET (JWT key)
- FRONTEND_URL (CORS)
- RATE_LIMIT_MAX, RATE_LIMIT_AUTH_MAX
- TMDB_API_KEY
- MISTRAL_API_KEY
- MISTRAL_API_URL (optional)
- MISTRAL_MODEL (optional)

Note: COOKIE_SECRET is present in docker-compose but not used in the code.

---

## 🐳 Docker

- docker-compose.dev.yml: backend + frontend + db (hot reload)
- docker-compose.yml: backend + db (prod)
- Dockerfile frontend: Vite build + nginx
- Dockerfile backend: Node build + healthcheck

---

Project functional locally via Docker (dev) or separate mode (backend + frontend). All features listed above are present in the current codebase.

---

## ☁️ Deployment (Azure)

**Production URL:** https://cinedelices-frontend.calmglacier-7bdfaf80.canadacentral.azurecontainerapps.io

### Infrastructure
- **Azure Container Apps** - Frontend and backend containers
- **Azure Container Registry** - Docker image storage (oclockContainerRegistry)
- **Azure Database for PostgreSQL** - Managed database (oclock-postreg-server)
- **Resource Group:** oclock-resources
- **Region:** Canada Central

### CI/CD
- **GitHub Actions** workflow (`.github/workflows/azure-deploy.yml`)
- Automatic build and deploy on push to `main` branch
- Node.js 20 for builds

### Scaling
```bash
# Keep replicas running (no cold starts)
az containerapp update --name cinedelices-backend --resource-group oclock-resources --min-replicas 1
az containerapp update --name cinedelices-frontend --resource-group oclock-resources --min-replicas 1

# Scale to zero (cost savings)
az containerapp update --name cinedelices-backend --resource-group oclock-resources --min-replicas 0
az containerapp update --name cinedelices-frontend --resource-group oclock-resources --min-replicas 0
```

---

## ❌ Not Implemented

- WCAG/Accessibility audit
- SEO (sitemap, robots.txt, meta tags optimization)
- GDPR compliance features (data export, deletion requests)

*Last updated: January 29, 2026*
*Version: 1.3.0*
