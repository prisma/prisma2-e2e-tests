#!/bin/sh

set -eux

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  files=',"files":["index.js","package.json","query-engine-rhel-openssl-1.0.x","schema.prisma"]'
else
  files=',"files":["index.js","libquery_engine-rhel-openssl-1.0.x.so.node","package.json","schema.prisma"]'
fi

# TODO Use deployment, not production
npx ts-node ../../utils/fetch-retry-and-confirm-version.ts --url https://e2e-vercel-api.vercel.app/api --prisma-version $(sh ../../utils/prisma_version.sh) --binary-string $files
