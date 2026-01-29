# Ciné Délices

A recipe-sharing platform inspired by movies and TV shows. Built with Svelte (frontend) + Express REST API (backend) + PostgreSQL/Sequelize. Features JWT authentication via httpOnly cookies (with Bearer token support), admin back-office, TMDB integration for movie data, and AI-powered recipe generation via **Mistral**.

## Live Demo

**Production URL:** https://cinedelices-frontend.calmglacier-7bdfaf80.canadacentral.azurecontainerapps.io

## Features

- **User Authentication** - Register, login, profile management with JWT tokens
- **Recipe Management** - Create, edit, delete recipes with ownership control
- **Movie Integration** - Browse movies/TV shows via TMDB API and link recipes to them
- **AI Recipe Generation** - Generate recipe ideas using Mistral AI based on selected movies
- **Admin Back-Office** - Manage users, recipes, categories, and media
- **Responsive Design** - Mobile-friendly UI

## Tech Stack

### Frontend
- **Svelte 5** + **Vite** - Modern reactive UI framework
- **svelte-spa-router** - Client-side routing
- **Responsive CSS** - Mobile-first design

### Backend
- **Node.js 20** + **Express 5** - REST API server
- **Sequelize** + **PostgreSQL** - ORM and database
- **JWT Authentication** - httpOnly cookies + Bearer token support
- **Security** - Helmet, rate limiting, CORS, input validation

### Infrastructure
- **Docker** - Containerized deployment
- **Azure Container Apps** - Production hosting
- **Azure Container Registry** - Docker image storage
- **Azure Database for PostgreSQL** - Managed database
- **GitHub Actions** - CI/CD pipeline

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone and Setup

```bash
git clone https://github.com/cool-machine/cinedelices_simplified.git
cd cinedelices_simplified
```

### 2. Environment Variables

Copy the example env file and configure:

```bash
cp .env.example .env
```

Required variables:
```env
# Database
DATABASE_URL=postgres://user:password@localhost:5433/cinedelices
DB_HOST=localhost
DB_PORT=5433
DB_NAME=cinedelices
DB_USER=user
DB_PASSWORD=password

# Auth
JWT_SECRET=your-secret-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# TMDB API
TMDB_API_KEY=your-tmdb-api-key

# Mistral AI (optional, for recipe generation)
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_MODEL=mistral-small-latest
MISTRAL_API_URL=https://api.mistral.ai/v1/chat/completions
```

### 3. Start with Docker Compose

```bash
# Start all services (database, backend, frontend)
docker-compose -f docker-compose.dev.yml up
```

Or run services individually:

```bash
# Start database only
docker-compose -f docker-compose.dev.yml up db

# Backend (in another terminal)
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### 4. Initialize Database

```bash
cd backend
npm run db:migrate
npm run db:seed
```

**Reset database if needed:**
```bash
npm run db:reset
```

## Project Structure

```
cinedelices_simplified/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth, validation
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # TMDB, Mistral integrations
│   │   └── utils/          # JWT, helpers
│   ├── tests/              # Jest tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # API client, stores
│   │   └── assets/         # Images, styles
│   └── Dockerfile
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Recipes
- `GET /api/v1/recipes` - List all recipes
- `GET /api/v1/recipes/:id` - Get recipe details
- `POST /api/v1/recipes` - Create recipe (auth required)
- `PUT /api/v1/recipes/:id` - Update recipe (owner only)
- `DELETE /api/v1/recipes/:id` - Delete recipe (owner only)
- `POST /api/v1/recipes/generate` - AI recipe generation (auth required)

### Movies (TMDB)
- `GET /api/v1/tmdb/search?query=...&type=...` - Search movies/TV shows
- `GET /api/v1/tmdb/:id?type=...` - Get movie/TV show details

### Admin
- `GET /api/v1/admin/users` - List users (admin only)
- `DELETE /api/v1/admin/users/:id` - Delete user (admin only)
- ... (categories, media management)

## Testing

```bash
cd backend
npm test           # Run all tests
npm run test:watch # Watch mode
```

Tests use **Jest** + **Supertest** with ESM modules support.

## Deployment

### Azure Container Apps (Production)

The app is deployed on Azure with:
- **Azure Container Apps** - Frontend and backend containers
- **Azure Container Registry** - Docker images
- **Azure Database for PostgreSQL** - Managed database
- **GitHub Actions** - Automated CI/CD on push to main

#### Scaling Configuration

To eliminate cold starts, set minimum replicas:

```bash
# Keep at least 1 replica running (no cold starts)
az containerapp update --name cinedelices-backend --resource-group oclock-resources --min-replicas 1
az containerapp update --name cinedelices-frontend --resource-group oclock-resources --min-replicas 1

# Scale to zero when not needed (cost savings)
az containerapp update --name cinedelices-backend --resource-group oclock-resources --min-replicas 0
az containerapp update --name cinedelices-frontend --resource-group oclock-resources --min-replicas 0
```

### Manual Deployment

See [docs/azure-deployment-guide.md](docs/azure-deployment-guide.md) for step-by-step Azure setup.

## CI/CD

GitHub Actions workflow (`.github/workflows/azure-deploy.yml`) automatically:
1. Builds Docker images for frontend and backend
2. Pushes to Azure Container Registry
3. Deploys to Azure Container Apps

Triggered on push to `main` branch.

## Documentation

- [Development Notes](docs/dev-notes.md) - Sprint progress and technical decisions
- [Azure Deployment Guide](docs/azure-deployment-guide.md) - Cloud setup instructions
- [Visual Documentation](docs/mockup.md) - Screenshots, wireframes, demo video

## Default Accounts (Development)

After seeding the database:

| Role  | Email            | Password    |
|-------|------------------|-------------|
| Admin | admin@test.com   | Password123 |
| User  | user@test.com    | Password123 |

## License

MIT
