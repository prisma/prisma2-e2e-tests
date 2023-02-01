#!/bin/sh

set -eu

# Yarn 1 has the following issue https://github.com/yarnpkg/yarn/issues/7807
# which shows with the following error in our `check-for-update` job":
# error An unexpected error occurred: "expected workspace package to exist for \"@babel/core\"".
# Solution: downgrading yarn with:
yarn policies set-version 1.18.0

export PRISMA_TELEMETRY_INFORMATION='ecosystem-tests platforms vercel-with-redwood build'

node patch-package-json.js

yarn

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Binary"
  export VERCEL_PROJECT_ID=$VERCEL_WITH_REDWOOD_BINARY_PROJECT_ID
else
  echo "Library (Default)"
  export VERCEL_PROJECT_ID=$VERCEL_WITH_REDWOOD_PROJECT_ID
  # Set local var to `library` for the `vercel deploy` command below
  PRISMA_CLIENT_ENGINE_TYPE=library
fi

export VERCEL_ORG_ID=$VERCEL_ORG_ID
export FORCE_RUNTIME_TAG=canary
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "FORCE_RUNTIME_TAG $FORCE_RUNTIME_TAG"

yarn redwood deploy vercel --no-data-migrate --no-prisma

echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "PRISMA_CLIENT_ENGINE_TYPE: $PRISMA_CLIENT_ENGINE_TYPE"
yarn -s vercel deploy --prod --yes --force --token=$VERCEL_TOKEN --env DATABASE_URL=$DATABASE_URL --build-env DEBUG="prisma:*" --build-env PRISMA_CLIENT_ENGINE_TYPE="$PRISMA_CLIENT_ENGINE_TYPE" --scope=$VERCEL_ORG_ID 1> deployment-url.txt

echo ''
cat deployment-url.txt
DEPLOYED_URL=$( tail -n 1 deployment-url.txt )
echo ''
echo "Deployed to ${DEPLOYED_URL}"

sleep 15
