# Ciné Délices — Notes de développement (réel)

> Document synthétique reflétant l’état **réel** du projet tel qu’il existe dans ce dépôt.

---

## ✅ Résumé

SPA Svelte (frontend) + API REST Express (backend) + PostgreSQL/Sequelize. Auth JWT en cookie httpOnly (compatible Bearer). Back‑office admin côté frontend et endpoints d’administration côté backend. Intégrations TMDB + génération de recette via **Mistral** (pas Gemini).

---

## 🧱 Stack technique réelle (avec emplacements)

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

---

## 🧬 Modèle de données (tables Sequelize)

### users
- id, email, password_hash, username, role, avatar_url, bio, created_at, updated_at

### categories
- id, name, description, created_at, updated_at

### media
- id, title, type (film|serie), image_url, release_year, created_at, updated_at

### recipes
- id, title, description, ingredients (texte), instructions (texte), anecdote,
  difficulty (facile|moyen|difficile), prep_time, cook_time, image_url,
  user_id, category_id, media_id, created_at, updated_at

---

## ✅ Fonctionnalités réellement implémentées (avec emplacements)

### Auth & profils
- Inscription / connexion / déconnexion (backend: [backend/src/controllers/authController.js](backend/src/controllers/authController.js), [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js); frontend: [frontend/src/pages/Login.svelte](frontend/src/pages/Login.svelte), [frontend/src/pages/Register.svelte](frontend/src/pages/Register.svelte), [frontend/src/lib/api.js](frontend/src/lib/api.js))
- JWT en cookie httpOnly (+ support Bearer) (backend: [backend/src/utils/jwt.js](backend/src/utils/jwt.js), [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js), cookie set in [backend/src/controllers/authController.js](backend/src/controllers/authController.js))
- Profil utilisateur + édition (bio, avatar, email, password) (backend: [backend/src/controllers/userController.js](backend/src/controllers/userController.js), [backend/src/routes/userRoutes.js](backend/src/routes/userRoutes.js); frontend: [frontend/src/pages/Profile.svelte](frontend/src/pages/Profile.svelte), [frontend/src/pages/ProfileEdit.svelte](frontend/src/pages/ProfileEdit.svelte))
- Accès admin via rôle user/admin (backend: [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js), [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js); frontend: [frontend/src/pages/admin/Dashboard.svelte](frontend/src/pages/admin/Dashboard.svelte))

### Recettes
- CRUD recettes (create/read/update/delete) (backend: [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js); frontend: [frontend/src/pages/Recipes.svelte](frontend/src/pages/Recipes.svelte), [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte), [frontend/src/pages/RecipeEdit.svelte](frontend/src/pages/RecipeEdit.svelte))
- Règles d’ownership (auteur ou admin) (backend: [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js); frontend: [frontend/src/pages/RecipeEdit.svelte](frontend/src/pages/RecipeEdit.svelte))
- Détail recette avec médias associés (backend: [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js); frontend: [frontend/src/pages/RecipeDetail.svelte](frontend/src/pages/RecipeDetail.svelte))

### Métadonnées
- Catégories (list) (backend: [backend/src/controllers/metadataController.js](backend/src/controllers/metadataController.js), [backend/src/routes/index.js](backend/src/routes/index.js); frontend: [frontend/src/pages/Recipes.svelte](frontend/src/pages/Recipes.svelte))
- Médias (list + création côté API) (backend: [backend/src/controllers/metadataController.js](backend/src/controllers/metadataController.js), [backend/src/routes/index.js](backend/src/routes/index.js); frontend: [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte))

### Back-office (API + UI)
- Statistiques globales (backend: [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js); frontend: [frontend/src/pages/admin/Dashboard.svelte](frontend/src/pages/admin/Dashboard.svelte))
- Gestion recettes, catégories, médias, utilisateurs (backend: [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js); frontend: [frontend/src/pages/admin/Recipes.svelte](frontend/src/pages/admin/Recipes.svelte), [frontend/src/pages/admin/Categories.svelte](frontend/src/pages/admin/Categories.svelte), [frontend/src/pages/admin/Media.svelte](frontend/src/pages/admin/Media.svelte), [frontend/src/pages/admin/Users.svelte](frontend/src/pages/admin/Users.svelte))

### TMDB
- Recherche films/séries (backend: [backend/src/routes/tmdbRoutes.js](backend/src/routes/tmdbRoutes.js), [backend/src/services/tmdbService.js](backend/src/services/tmdbService.js); frontend: [frontend/src/pages/Movies.svelte](frontend/src/pages/Movies.svelte))
- Détails TMDB (backend: [backend/src/routes/tmdbRoutes.js](backend/src/routes/tmdbRoutes.js), [backend/src/services/tmdbService.js](backend/src/services/tmdbService.js))
- Pré-remplissage depuis TMDB pour création de recette (frontend: [frontend/src/pages/Movies.svelte](frontend/src/pages/Movies.svelte), [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte))

### IA (Mistral)
- Endpoint de génération de recette à partir d’un film/série (backend: [backend/src/services/mistralService.js](backend/src/services/mistralService.js), [backend/src/controllers/recipeController.js](backend/src/controllers/recipeController.js), [backend/src/routes/recipeRoutes.js](backend/src/routes/recipeRoutes.js); frontend: [frontend/src/pages/RecipeNew.svelte](frontend/src/pages/RecipeNew.svelte))
- Activé si MISTRAL_API_KEY est configurée (backend: [backend/src/services/mistralService.js](backend/src/services/mistralService.js))

### Ops
- Health check: /health (backend: [backend/src/app.js](backend/src/app.js#L66-L69))
- 404 API propre (backend: [backend/src/app.js](backend/src/app.js#L72-L75))

---

## 🧭 Routes frontend (SPA)

- / (Home)
- /movies (recherche TMDB)
- /recipes (catalogue + filtres côté client)
- /recipes/:id (détail)
- /recipes/new (création, avec option IA)
- /recipes/:id/edit (édition)
- /login, /register
- /profile/:id, /profile/edit
- /admin + sections admin (recipes, categories, media, users)
- /legal, /privacy, /about, /contact
- /not-found (catch-all)

---

## 🧪 Tests existants

- Unit: JWT utils, recipeController
- Integration: TMDB routes

---

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

Note: COOKIE_SECRET est présent dans docker-compose mais n’est pas utilisé dans le code.

---

## 🐳 Docker

- docker-compose.dev.yml: backend + frontend + db (hot reload)
- docker-compose.yml: backend + db (prod)
- Dockerfile frontend: build Vite + nginx
- Dockerfile backend: build Node + healthcheck

---
Projet fonctionnel en local via Docker (dev) ou en mode séparé (backend + frontend). Toutes les fonctionnalités listées ci-dessus sont présentes dans le codebase actuel.

---

## ❌ Non implémenté (à vérifier)

- Ancien plan EJS/MVC côté serveur (views, sessions).
- Roadmap sprints détaillée, checklists et conventions Git/CI/CD.
- Déploiement Azure/CI‑CD, SEO/Accessibilité/RGPD (présents dans l’ancienne doc, pas dans le code).

*Document mis à jour le : 26 janvier 2026*
*Version : 1.2.0*
