# Azure Deployment Options for Ciné Délices

Since you are already using **Docker**, **GitHub Actions**, and have an **Azure** contract, you have a very robust path to production.

Here is a breakdown of your best options for deploying the "Simplified MVP" (Svelte Frontend + Node Backend + Postgres).

## The Core Infrastructure (Required for all options)

Regardless of which compute service you choose, you should use these two managed services:

1.  **Azure Container Registry (ACR)**
    *   **Purpose**: Stores your Docker images (private, secure).
    *   **Workflow**: GitHub Actions builds your images (`backend`, `frontend`) and pushes them here.
    *   **Why**: It's the standard glue between GitHub Actions and Azure compute.

2.  **Azure Database for PostgreSQL (Flexible Server)**
    *   **Purpose**: Hosting your data.
    *   **Important**: Do **NOT** run your database in a Docker container for production.
    *   **Why**: Managed backups, security, high availability, and scaling.
    *   **Cost**: "Burstable" tier is very cheap for MVPs (~$10-15/mo).

---

## Option 1: Azure Container Apps (Recommended) 🏆

This is the modern, "serverless container" approach. It sits between simple App Service and complex Kubernetes.

*   **Architecture**:
    *   Create one **Container App Environment**.
    *   Deploy **Backend** as a Container App (Ingress: Internal or External).
    *   Deploy **Frontend** as a Container App (Ingress: External, targeting backend DNS).
*   **Pros**:
    *   **Scale to Zero**: If no one uses it (e.g., at night), it can scale down to save money.
    *   **Microservices friendly**: Perfect for running frontend and backend as separate, communicating services.
    *   **KEDA Scaling**: Auto-scale based on HTTP traffic or CPU.
*   **Cons**:
    *   Slightly newer model to learn than App Service.
*   **Verdict**: **Best fit** for a modern Dockerized app.

## Option 2: Azure App Service for Containers

The classic "Web App" PaaS (Platform as a Service).

*   **Architecture**:
    *   Create an **App Service Plan** (Linux).
    *   Create a **Web App** for the Backend.
    *   Create a **Web App** for the Frontend.
*   **Pros**:
    *   **Extremely Mature**: Very stable, well-documented.
    *   **Easy Setup**: "Click Next" experience.
    *   **Deployment Slots**: Staging/Production swaps (great for zero-downtime).
*   **Cons**:
    *   **Cost**: You pay for the App Service Plan (VM) 24/7, even if idle.
    *   Multi-container (Docker Compose) support exists but can be slower/complex to debug network-wise compared to separated apps.
*   **Verdict**: **Solid choice** if you prefer a traditional server model or have existing App Service plans to reuse.

## Option 3: Azure Kubernetes Service (AKS)

*   **Pros**: Ultimate control, industry standard for massive scale.
*   **Cons**: **Massive Overkill** for this MVP. High management overhead (upgrades, node pools) and minimum cost is higher.
*   **Verdict**: **Avoid** unless you specifically need to learn Kubernetes.

---

## Recommended Workflow (CI/CD)

Here is how your **GitHub Actions** pipeline will look:

1.  **Trigger**: Push to `main`.
2.  **Job 1: Build & Push**
    *   Log in to **ACR**.
    *   Build `backend` Docker image -> Push to ACR.
    *   Build `frontend` Docker image -> Push to ACR.
3.  **Job 2: Deploy**
    *   Log in to **Azure**.
    *   Update **Azure Container App** (or App Service) to pull the new image tag.
    *   Run migrations (optional step, usually run via a temporary container or command).

## Summary Table

| Feature | Container Apps (ACA) | App Service (Linux) |
| :--- | :--- | :--- |
| **Cost Model** | Pay per second (vCPU/Memory) + Requests | Pay per hour (User Plan) |
| **Scale to Zero** | ✅ Yes | ❌ No |
| **Docker Support** | First-class citizen | Good |
| **Complexity** | Medium | Low |
| **Best For** | Modern Cloud-Native Apps | Traditional Web Hosting |

### My Recommendation
Go with **Option 1 (Azure Container Apps)**. It aligns perfectly with your "startup" context—it's cost-effective for low traffic (MVP phase) but scales indefinitely if you succeed.
