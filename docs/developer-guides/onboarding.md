# Monorepo Environment Configuration & Onboarding Guide

Follow these steps to configure your local system dependencies for development.

## 🛠️ Step 1: Pre-requisite Local System Packages

Ensure your machine runs Node.js v20+ along with Docker Desktop.

## 🚀 Step 2: Initialize Workspace Configurations

From the root of the project repository, install the dependencies across the monorepo workspace matrix:

```bash
# Clean install all isolated package node module layers
npm install

# Build all local shared package entities
npm run build --workspaces

# Fire up local development data persistence nodes (PostgreSQL, Redpanda, Redis)
docker-compose -f deploy/docker-compose.yml up -d
```
