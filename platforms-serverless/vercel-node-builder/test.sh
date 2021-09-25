#!/bin/sh

set -eux
DEPLOYED_URL=$( tail -n 1 deployment-url.txt )

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  files=',"files":["index.js","package.json","query-engine-rhel-openssl-1.0.x","schema.prisma"]'
else
  files=',"files":["index.js","libquery_engine-rhel-openssl-1.0.x.so.node","package.json","schema.prisma"]'
fi

npx ts-node ../../utils/fetch-retry-and-confirm-version.ts --url $DEPLOYED_URL --prisma-version $(sh ../../utils/prisma_version.sh) --binary-string ${files}
