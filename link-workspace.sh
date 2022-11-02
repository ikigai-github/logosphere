#!/usr/bin/env bash

set -e
echo ""
echo "<<< Installing Logosphere SDK dependencies >>>"
pnpm install

echo ""
echo "<<< Building Logosphere SDK libraries >>>"
pnpm nx build cardano
pnpm nx  build configuration
pnpm nx  build converters
pnpm nx  build decorators
pnpm nx  build domain
pnpm nx  build errors
pnpm nx  build fluree
pnpm nx  build ipfs
pnpm nx  build media
pnpm nx  build readers
pnpm nx  build sdk
pnpm nx  build test-data
pnpm nx  build utils

workspace=$1
pushd ../${workspace}

echo ""
echo "<<< Linking workspace ${workspace} >>>"

pnpm link ../logosphere/dist/libs/cardano
pnpm link ../logosphere/dist/libs/configuration
pnpm link ../logosphere/dist/libs/converters
pnpm link ../logosphere/dist/libs/decorators
pnpm link ../logosphere/dist/libs/domain
pnpm link ../logosphere/dist/libs/errors
pnpm link ../logosphere/dist/libs/readers
pnpm link ../logosphere/dist/libs/sdk
pnpm link ../logosphere/dist/libs/fluree
pnpm link ../logosphere/dist/libs/test-data
pnpm link ../logosphere/dist/libs/utils
popd
echo ""
echo "<<< Workspace ${workspace} has been linked >>>"
