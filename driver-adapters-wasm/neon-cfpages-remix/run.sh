#!/usr/bin/env bash

set -eu

# Since we modify the package.json to add `"db": "link:prisma/client`
# `--no-frozen-lockfile` is required to avoid the error:
# `ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json`
pnpm install --no-frozen-lockfile

pnpm prisma generate
pnpm build

pnpm wrangler pages deploy ./build/client --project-name neon-cfpages-remix | tee deployment-logs.txt
sleep 15