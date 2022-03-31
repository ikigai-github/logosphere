#!/usr/bin/env bash

set -e

echo ""
echo "<<< Building SDK >>>"
pushd logosphere-sdk 
pnpm install
pnpm run build 
popd

echo ""
echo "<<< Building schematics >>>"
pushd logosphere-schematics
pnpm install
pnpm build
pnpm run postbuild
popd

echo ""
echo "<<< Building CLI >>>"
pushd logosphere-cli 
pnpm link ../logosphere-sdk
pnpm install
pnpm run build 
popd

echo ""
echo "<<< Building primer >>>"
pushd logosphere-primer 
pnpm link ../logosphere-schematics
pnpm link ../logosphere-cli 
pnpm install
pnpm run build
popd

echo ""
echo "<<< Generating launch script >>>"
echo "#!/usr/bin/env bash" > logos
echo "$(pwd)/logosphere-primer/node_modules/.bin/logos \$1 \$2" >> logos
chmod +x logos

echo ""
echo "<<< Build Completed Succesfully! >>"
echo "You can copy the logos script to /usr/local/bin if you would like it in your global path"
