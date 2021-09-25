#!/bin/sh

set -eux

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  files=',"files":["index-browser.js","index.d.ts","index.js","package.json","query-engine-debian-openssl-1.1.x","schema.prisma"]'
else
  files=',"files":["index-browser.js","index.d.ts","index.js","libquery_engine-debian-openssl-1.1.x.so.node","package.json","schema.prisma"]'
fi

npx ts-node ../../utils/fetch-retry-and-confirm-version.ts --url https://e2e-platforms-heroku.herokuapp.com --prisma-version $(sh ../../utils/prisma_version.sh) --binary-string $files
