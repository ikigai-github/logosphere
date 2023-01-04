#!/usr/bin/env bash

set -e
echo ""
echo "<<< Installing Logosphere SDK dependencies >>>"
pnpm install

echo ""
echo "<<< Building Logosphere SDK libraries >>>"
pnpm nx affected:build --all --skip-nx-cache

workspace=$1
pushd ../${workspace}

echo ""
echo "<<< Linking workspace ${workspace} >>>"

pnpm link ../logosphere/dist/libs/cardano
pnpm link ../logosphere/dist/libs/fluree
pnpm link ../logosphere/dist/libs/ipfs
pnpm link ../logosphere/dist/libs/media
pnpm link ../logosphere/dist/libs/model
pnpm link ../logosphere/dist/libs/schema
pnpm link ../logosphere/dist/libs/sdk

popd
echo ""
echo "<<< Workspace ${workspace} has been linked >>>"
