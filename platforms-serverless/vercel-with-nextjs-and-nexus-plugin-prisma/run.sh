#!/bin/sh

set -eu

export PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms-serverless vercel-with-nextjs-and-nexus-plugin-prisma build'
yarn

yarn build

export VERCEL_PROJECT_ID=$VERCEL_WITH_NEXTJS_AND_NEXUS_PLUGIN_PRISMA_PROJECT_ID
export VERCEL_ORG_ID=$VERCEL_WITH_NEXTJS_AND_NEXUS_PLUGIN_PRISMA_ORG_ID
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
yarn vercel --token=$VERCEL_TOKEN --prod --scope=prisma --confirm

sleep 15
