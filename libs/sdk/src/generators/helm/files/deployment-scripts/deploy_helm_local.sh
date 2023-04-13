#!/bin/sh

set -e

echo node_modules >> .dockerignore
<% applications.forEach(function(application){ %>
docker build -t logosphere/<%= application.name %>:latest -f ./<%= application.path %>/Dockerfile .
<% }); %>
rm -f .dockerignore

if helm list -n logo | grep -q logosphere; then
    helm uninstall -n logo logosphere
fi
if helm repo list | grep -q ikigai-blockfrost; then
    helm repo rm ikigai-blockfrost
fi
helm repo add ikigai-blockfrost http://ikigai-shared-helm-charts-public.s3-website-us-east-1.amazonaws.com/blockfrost
helm dependency build ./helm
helm install --create-namespace -n logo logosphere ./helm