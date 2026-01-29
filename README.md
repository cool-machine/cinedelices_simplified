# Ciné Délices

SPA Svelte (frontend) + API REST Express (backend) + PostgreSQL/Sequelize. Auth JWT en cookie httpOnly (compatible Bearer). Back‑office admin côté frontend et endpoints d’administration côté backend. Intégrations TMDB + génération de recette via **Mistral** (pas Gemini).

## 🏃 Sprints (réalisés)

### Sprint 0 — Conception
- Exigences cadrées depuis [docs/requirements/CinéDélices.md](docs/requirements/CinéDélices.md).
- MCD, MLD, MPD définis.

### Sprint 1 — Mise en Place (Setup Technique)
- Backend Express opérationnel + routage principal (entry [backend/server.js](backend/server.js), app [backend/src/app.js](backend/src/app.js), router [backend/src/routes/index.js](backend/src/routes/index.js)).
- Modèles Sequelize + migrations/seeders (models [backend/src/models](backend/src/models), migrations [backend/src/migrations](backend/src/migrations), seeders [backend/src/seeders](backend/src/seeders)).
- Frontend SPA Svelte initialisé + routing (bootstrap [frontend/src/main.js](frontend/src/main.js), app [frontend/src/App.svelte](frontend/src/App.svelte), routes [frontend/src/routes.js](frontend/src/routes.js)).
- Docker dev/prod en place ([docker-compose.dev.yml](docker-compose.dev.yml), [docker-compose.yml](docker-compose.yml), backend [backend/Dockerfile](backend/Dockerfile), frontend [frontend/Dockerfile](frontend/Dockerfile)).

### Sprint 2 — Développement des Fonctionnalités MVP
- Auth JWT + profils (controllers [backend/src/controllers/authController.js](backend/src/controllers/authController.js), middleware [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js), pages [frontend/src/pages/Login.svelte](frontend/src/pages/Login.svelte), [frontend/src/pages/Register.svelte](frontend/src/pages/Register.svelte), [frontend/src/pages/Profile.svelte](frontend/src/pages/Profile.svelte), [frontend/src/pages/ProfileEdit.svelte](frontend/src/pages/ProfileEdit.svelte)).
- CRUD recettes + ownership (backend [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), routes [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js), frontend [frontend/src/pages/Recipes.svelte](frontend/src/pages/Recipes.svelte), [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte), [frontend/src/pages/RecipeEdit.svelte](frontend/src/pages/RecipeEdit.svelte), [frontend/src/pages/RecipeDetail.svelte](frontend/src/pages/RecipeDetail.svelte)).
- Back‑office admin (API + UI) (routes [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js), pages [frontend/src/pages/admin/Dashboard.svelte](frontend/src/pages/admin/Dashboard.svelte), [frontend/src/pages/admin/Recipes.svelte](frontend/src/pages/admin/Recipes.svelte), [frontend/src/pages/admin/Categories.svelte](frontend/src/pages/admin/Categories.svelte), [frontend/src/pages/admin/Media.svelte](frontend/src/pages/admin/Media.svelte), [frontend/src/pages/admin/Users.svelte](frontend/src/pages/admin/Users.svelte)).
- Métadonnées catégories/médias (backend [backend/src/controllers/metadataController.js](backend/src/controllers/metadataController.js), routes [backend/src/routes/index.js](backend/src/routes/index.js)).

### Sprint 3 — Finitions, Tests & Intégrations
- Intégration TMDB (service [backend/src/services/tmdbService.js](backend/src/services/tmdbService.js), routes [backend/src/routes/tmdbRoutes.js](backend/src/routes/tmdbRoutes.js), page [frontend/src/pages/Movies.svelte](frontend/src/pages/Movies.svelte)).
- Génération de recette via Mistral (service [backend/src/services/mistralService.js](backend/src/services/mistralService.js), endpoint [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js), UI [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte)).
- Tests unitaires & intégration (tests [backend/tests](backend/tests), config [backend/jest.config.js](backend/jest.config.js)).
- Ops API: healthcheck + 404 propre (app [backend/src/app.js](backend/src/app.js#L66-L75)).

## 🧱 Stack technique réelle

### Frontend
- Svelte 5 + Vite (bootstrap [frontend/src/main.js](frontend/src/main.js#L1-L9), root [frontend/src/App.svelte](frontend/src/App.svelte))
- Router SPA: svelte-spa-router (routes [frontend/src/routes.js](frontend/src/routes.js), usage [frontend/src/App.svelte](frontend/src/App.svelte#L1-L21))

### Backend
- Node.js 20 + Express 5 (entry [backend/server.js](backend/server.js), app [backend/src/app.js](backend/src/app.js#L1-L120))
- Sequelize + PostgreSQL (models [backend/src/models](backend/src/models), config [backend/src/config/config.js](backend/src/config/config.js))
- Auth: JWT (cookie httpOnly + Bearer) (utils [backend/src/utils/jwt.js](backend/src/utils/jwt.js), auth flow [backend/src/controllers/authController.js](backend/src/controllers/authController.js), middleware [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js))
- Sécurité: Helmet, rate limiting, CORS, cookie-parser (middlewares [backend/src/app.js](backend/src/app.js#L1-L90))
- Validation: express-validator (schemas [backend/src/validations/recipeSchema.js](backend/src/validations/recipeSchema.js), routes [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js))

### Tooling
- Tests: Jest + Supertest (tests [backend/tests](backend/tests), config [backend/jest.config.js](backend/jest.config.js))
- Lint: ESLint (config [backend/eslint.config.js](backend/eslint.config.js))
- Docker: docker-compose (dev + prod) ([docker-compose.dev.yml](docker-compose.dev.yml), [docker-compose.yml](docker-compose.yml))

## ✅ Fonctionnalités implémentées

- Auth & profils, recettes, back‑office, TMDB, IA Mistral (détails dans [docs/dev-notes.md](docs/dev-notes.md)).

## 🧪 Tests existants

- Unit: JWT utils, recipeController
- Integration: TMDB routes

## 🔧 Variables d’environnement utilisées

Backend:
- DATABASE_URL
- SESSION_SECRET (clé JWT)
- FRONTEND_URL (CORS)
- RATE_LIMIT_MAX, RATE_LIMIT_AUTH_MAX
- TMDB_API_KEY
- MISTRAL_API_KEY
- MISTRAL_API_URL (optionnel)
- MISTRAL_MODEL (optionnel)

## 🐳 Docker

- docker-compose.dev.yml: backend + frontend + db (hot reload)
- docker-compose.yml: backend + db (prod)
- Dockerfile frontend: build Vite + nginx
- Dockerfile backend: build Node + healthcheck

## 📦 Déploiement Azure

Guide complet dans [docs/azure-deployment-guide.md](docs/azure-deployment-guide.md).

## ❌ Non implémenté (à vérifier)

- WCAG/accessibilité.
- SEO (checklist, sitemap/robots).
- CI/CD automatisé.
