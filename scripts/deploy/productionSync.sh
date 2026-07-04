#!/usr/bin/env bash

set -euo pipefail

TARGET_NAMESPACE="nexuscore-identity-prod"
IMAGE_TAG="v1.2.4"

echo "🚢 Initializing deployment update sequence for tag: ${IMAGE_TAG}..."

# 1. Apply baseline isolation namespaces and core configurations
kubectl apply -f deploy/kubernetes/namespace.yaml
kubectl apply -f deploy/kubernetes/configmap.yaml

# 2. Trigger zero-downtime rolling updates across the API Gateway cluster pods
echo "🔄 Rolling out container images to production clusters..."
kubectl set image deployment/api-gateway-deployment \
    gateway-container=nexuscore/identity-api-gateway:${IMAGE_TAG} \
    --namespace=${TARGET_NAMESPACE}

# 3. Monitor rollout state to ensure target availability metrics are met
echo "🔍 Validating cluster pod status..."
if kubectl rollout status deployment/api-gateway-deployment --namespace=${TARGET_NAMESPACE} --timeout=90s; then
    echo "✅ Rollout completed. Pod configurations updated without service disruption."
else
    echo "❌ Deployment timeout reached! Reverting to previous stable image layout immediately..."
    kubectl rollout undo deployment/api-gateway-deployment --namespace=${TARGET_NAMESPACE}
    exit 1
fi

# 4. Refresh routing and autoscaler parameters
kubectl apply -f deploy/kubernetes/ingress.yaml
kubectl apply -f deploy/kubernetes/hpa.yaml

echo "🎉 Production synchronization successfully verified across all targets."