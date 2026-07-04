#!/usr/bin/env bash

# Exit immediately if any command flags an unexpected runtime failure status
set -euo pipefail

echo "⚙️ Initializing NexusCore Digital Identity Monorepo Ecosystem Environment..."

# 1. Trace parent directory execution paths accurately
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# 2. Local environment configuration file assembly
if [ ! -f .env ]; then
    echo "📋 Generating development environment parameters inside local path profiles..."
    
    # Construct distinct high-entropy keys using operating system entropy pools
    JWT_GENERATED_SECRET=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32 || true)
    DB_GENERATED_PASS=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 24 || true)

    cat << EOF > .env
NODE_ENV=development
PORT=3000
JWT_SECRET=${JWT_GENERATED_SECRET}
DB_HOST=127.0.0.1
DB_NAME=identity_platform
DB_USER=nexus_admin
DB_PASSWORD=${DB_GENERATED_PASS}
WS_RPC_URL=ws://127.0.0.1:8546
RPC_URL=http://127.0.0.1:8545
EOF
    echo "✅ Configuration file successfully mounted."
else
    echo "ℹ️ Existing configuration layer identified. Skipping generation to protect data entries."
fi

# 3. Clean environment compilation tasks
echo "📦 Installing internal module footprints across monorepo workspace sets..."
npm install

echo "🔨 Executing structural builds for shared internal packages..."
npm run build --workspaces

echo "🚀 Staging environment successfully prepared. Run 'docker-compose up -d' to start storage clusters."