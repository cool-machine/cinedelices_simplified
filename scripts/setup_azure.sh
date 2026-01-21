#!/bin/bash

# Azure Setup Script for Ciné Délices (Simplified MVP)
# Region: East US 2 (AI Ready)

# Configuration
RG_NAME="rg-cinedelices-mvp"
LOCATION="eastus2"
ACR_NAME="acrcinedelices$(date +%s)" # Unique name
DB_SERVER_NAME="psql-cinedelices-$(date +%s)"
DB_NAME="cinedelices_prod"
ACA_ENV_NAME="aca-env-cinedelices"

echo "🚀 Starting Azure Setup in $LOCATION..."

# 1. Create Resource Group
echo "Creating Resource Group: $RG_NAME..."
az group create --name $RG_NAME --location $LOCATION

# 2. Create Azure Container Registry (ACR)
echo "Creating Container Registry: $ACR_NAME..."
az acr create --resource-group $RG_NAME --name $ACR_NAME --sku Basic --admin-enabled true

# 3. Create PostgreSQL Flexible Server
echo "Creating PostgreSQL Server (this may take a few minutes)..."
az postgres flexible-server create \
    --resource-group $RG_NAME \
    --name $DB_SERVER_NAME \
    --location $LOCATION \
    --admin-user "cinedelices_admin" \
    --admin-password "CinemaDelicieux2026!" \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --storage-size 32 \
    --database-name $DB_NAME \
    --yes

# 4. Create Container Apps Environment
echo "Creating Container Apps Environment: $ACA_ENV_NAME..."
az containerapp env create \
    --name $ACA_ENV_NAME \
    --resource-group $RG_NAME \
    --location $LOCATION

echo "✅ Azure Infrastructure Setup Complete!"
echo "---------------------------------------"
echo "Resource Group: $RG_NAME"
echo "Region: $LOCATION"
echo "ACR Name: $ACR_NAME"
echo "DB Server: $DB_SERVER_NAME"
echo "DB User: cinedelices_admin"
echo "DB Password: CinemaDelicieux2026!"
echo "---------------------------------------"
echo "Next Step: Configure GitHub Secrets with these values."
