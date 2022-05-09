#!/usr/bin/env bash

set -e
echo ""
echo "<<< Installing Logosphere SDK dependencies >>>"
pnpm install

echo ""
echo "<<< Building Logosphere SDK libraries >>>"
pnpm nx affected:build

workspace=$1
pushd ../${workspace}

echo ""
echo "<<< Linking workspace ${workspace} >>>"

pnpm link ../logosphere/dist/libs/configuration
pnpm link ../logosphere/dist/libs/converters
pnpm link ../logosphere/dist/libs/decorators
pnpm link ../logosphere/dist/libs/errors
pnpm link ../logosphere/dist/libs/model
pnpm link ../logosphere/dist/libs/readers
pnpm link ../logosphere/dist/libs/sdk
pnpm link ../logosphere/dist/libs/fluree
pnpm link ../logosphere/dist/libs/test-data
pnpm link ../logosphere/dist/libs/utils
popd
echo ""
echo "<<< Workspace ${workspace} has been linked >>>"
