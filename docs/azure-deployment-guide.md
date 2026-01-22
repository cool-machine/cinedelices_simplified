# Azure Deployment Guide - Ciné Délices

This guide walks you through deploying the Ciné Délices application to Azure using:
- **Azure Container Registry (ACR)** - Store Docker images
- **Azure Database for PostgreSQL** - Managed database
- **Azure Container Apps (ACA)** - Host frontend & backend

**Prerequisites:**
- Azure CLI installed (`brew install azure-cli` on Mac)
- Docker installed
- Resource group `oclock` already exists

---

## Step 1: Login to Azure

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_NAME"

# Verify resource group exists
az group show --name oclock
```

---

## Step 2: Create Azure Container Registry (ACR)

```bash
# Create the container registry
az acr create \
  --resource-group oclock \
  --name cinedelicesacr \
  --sku Basic \
  --admin-enabled true

# Get the login server name (save this!)
az acr show --name cinedelicesacr --query loginServer --output tsv
# Output: cinedelicesacr.azurecr.io

# Get ACR credentials (save these for GitHub Actions!)
az acr credential show --name cinedelicesacr
```

**Save these values:**
- `ACR_LOGIN_SERVER`: cinedelicesacr.azurecr.io
- `ACR_USERNAME`: cinedelicesacr
- `ACR_PASSWORD`: (from the command above)

---

## Step 3: Create Azure Database for PostgreSQL

```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group oclock \
  --name cinedelices-db-server \
  --location westeurope \
  --admin-user cinedelices_admin \
  --admin-password 'YourSecurePassword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --public-access 0.0.0.0

# Create the database
az postgres flexible-server db create \
  --resource-group oclock \
  --server-name cinedelices-db-server \
  --database-name cinedelices_db

# Get the connection string
az postgres flexible-server show \
  --resource-group oclock \
  --name cinedelices-db-server \
  --query fullyQualifiedDomainName \
  --output tsv
# Output: cinedelices-db-server.postgres.database.azure.com
```

**Save these values:**
- `DB_HOST`: cinedelices-db-server.postgres.database.azure.com
- `DB_USER`: cinedelices_admin
- `DB_PASSWORD`: YourSecurePassword123!
- `DB_NAME`: cinedelices_db
- `DB_PORT`: 5432

---

## Step 4: Create Azure Container Apps Environment

```bash
# Create the Container Apps environment
az containerapp env create \
  --resource-group oclock \
  --name cinedelices-env \
  --location westeurope
```

---

## Step 5: Build and Push Docker Images

### 5a. Login to ACR from Docker

```bash
# Login to ACR
az acr login --name cinedelicesacr
```

### 5b. Build and Push Backend Image

```bash
cd /Users/gg1900/coding/cinedelices_simplified/backend

# Build the image
docker build -t cinedelicesacr.azurecr.io/cinedelices-backend:latest .

# Push to ACR
docker push cinedelicesacr.azurecr.io/cinedelices-backend:latest
```

### 5c. Build and Push Frontend Image

```bash
cd /Users/gg1900/coding/cinedelices_simplified/frontend

# Build the image
docker build -t cinedelicesacr.azurecr.io/cinedelices-frontend:latest .

# Push to ACR
docker push cinedelicesacr.azurecr.io/cinedelices-frontend:latest
```

---

## Step 6: Deploy Backend Container App

```bash
# Get ACR password
ACR_PASSWORD=$(az acr credential show --name cinedelicesacr --query "passwords[0].value" -o tsv)

# Create backend container app
az containerapp create \
  --resource-group oclock \
  --name cinedelices-backend \
  --environment cinedelices-env \
  --image cinedelicesacr.azurecr.io/cinedelices-backend:latest \
  --registry-server cinedelicesacr.azurecr.io \
  --registry-username cinedelicesacr \
  --registry-password "$ACR_PASSWORD" \
  --target-port 3000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 3 \
  --env-vars \
    NODE_ENV=production \
    DB_HOST=cinedelices-db-server.postgres.database.azure.com \
    DB_USER=cinedelices_admin \
    DB_PASSWORD='YourSecurePassword123!' \
    DB_NAME=cinedelices_db \
    DB_PORT=5432 \
    JWT_SECRET='your-super-secret-jwt-key-change-this' \
    TMDB_API_KEY='your-tmdb-api-key' \
    CORS_ORIGIN='https://cinedelices-frontend.YOUR_REGION.azurecontainerapps.io'

# Get the backend URL (save this!)
az containerapp show \
  --resource-group oclock \
  --name cinedelices-backend \
  --query properties.configuration.ingress.fqdn \
  --output tsv
# Output: cinedelices-backend.xxxxx.westeurope.azurecontainerapps.io
```

---

## Step 7: Deploy Frontend Container App

```bash
# Get the backend URL first
BACKEND_URL=$(az containerapp show --resource-group oclock --name cinedelices-backend --query properties.configuration.ingress.fqdn -o tsv)

# Create frontend container app
az containerapp create \
  --resource-group oclock \
  --name cinedelices-frontend \
  --environment cinedelices-env \
  --image cinedelicesacr.azurecr.io/cinedelices-frontend:latest \
  --registry-server cinedelicesacr.azurecr.io \
  --registry-username cinedelicesacr \
  --registry-password "$ACR_PASSWORD" \
  --target-port 80 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 3 \
  --env-vars \
    VITE_API_URL="https://$BACKEND_URL"

# Get the frontend URL
az containerapp show \
  --resource-group oclock \
  --name cinedelices-frontend \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

---

## Step 8: Update Backend CORS Settings

After getting the frontend URL, update the backend's CORS_ORIGIN:

```bash
FRONTEND_URL=$(az containerapp show --resource-group oclock --name cinedelices-frontend --query properties.configuration.ingress.fqdn -o tsv)

az containerapp update \
  --resource-group oclock \
  --name cinedelices-backend \
  --set-env-vars CORS_ORIGIN="https://$FRONTEND_URL"
```

---

## Step 9: Run Database Migrations

You need to run migrations against the Azure PostgreSQL database. Option 1 is to run locally:

```bash
cd /Users/gg1900/coding/cinedelices_simplified/backend

# Set environment variables for Azure DB
export DB_HOST=cinedelices-db-server.postgres.database.azure.com
export DB_USER=cinedelices_admin
export DB_PASSWORD='YourSecurePassword123!'
export DB_NAME=cinedelices_db
export DB_PORT=5432

# Run migrations
npm run db:migrate

# Run seeds (optional - for demo data)
npm run db:seed
```

---

## Step 10: Verify Deployment

```bash
# Check backend health
curl https://cinedelices-backend.xxxxx.westeurope.azurecontainerapps.io/api/v1/recipes

# Open frontend in browser
open https://cinedelices-frontend.xxxxx.westeurope.azurecontainerapps.io
```

---

## Summary of Created Resources

| Resource | Name | Purpose |
|----------|------|---------|
| Container Registry | cinedelicesacr | Store Docker images |
| PostgreSQL Server | cinedelices-db-server | Database |
| Container Apps Env | cinedelices-env | Hosting environment |
| Container App | cinedelices-backend | Backend API |
| Container App | cinedelices-frontend | Frontend UI |

---

## GitHub Secrets to Add (for CI/CD)

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret Name | Value |
|-------------|-------|
| `AZURE_CREDENTIALS` | Service principal JSON (see below) |
| `ACR_LOGIN_SERVER` | cinedelicesacr.azurecr.io |
| `ACR_USERNAME` | cinedelicesacr |
| `ACR_PASSWORD` | (from Step 2) |
| `DB_HOST` | cinedelices-db-server.postgres.database.azure.com |
| `DB_USER` | cinedelices_admin |
| `DB_PASSWORD` | YourSecurePassword123! |
| `JWT_SECRET` | your-jwt-secret |
| `TMDB_API_KEY` | your-tmdb-api-key |

### Create Service Principal for GitHub Actions

```bash
az ad sp create-for-rbac \
  --name "cinedelices-github-actions" \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/oclock \
  --sdk-auth
```

Copy the entire JSON output and save it as `AZURE_CREDENTIALS` secret in GitHub.

---

## Useful Commands

```bash
# View logs
az containerapp logs show --resource-group oclock --name cinedelices-backend --follow

# Restart container
az containerapp revision restart --resource-group oclock --name cinedelices-backend

# Scale manually
az containerapp update --resource-group oclock --name cinedelices-backend --min-replicas 1

# Delete everything (BE CAREFUL!)
az containerapp delete --resource-group oclock --name cinedelices-frontend --yes
az containerapp delete --resource-group oclock --name cinedelices-backend --yes
az containerapp env delete --resource-group oclock --name cinedelices-env --yes
az postgres flexible-server delete --resource-group oclock --name cinedelices-db-server --yes
az acr delete --resource-group oclock --name cinedelicesacr --yes
```
