#!/usr/bin/env bash

set -eu

pnpm install

pnpm prisma generate

pnpm wrangler pages deploy . --project-name d1-cfpages-nuxt | tee deployment-logs.txt
sleep 15
