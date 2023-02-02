#!/bin/sh

set -eu
# Replace by the following line to debug this script
# set -eux

export PRISMA_TELEMETRY_INFORMATION='ecosystem-tests platforms vercel-cli-cache-repro build'

yarn

# Note: be aware that Vercel truncates logs, so if you add something like `--build-env DEBUG="prisma:*"` plenty of logs will be missing.
# That will likely influence the "Postinstall hook" check below, which will result in the CI failing with error code `1`.

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Binary"
  echo "Deployment does not exist yet"
  exit 0
else
  echo "Library (Default)"
  export VERCEL_PROJECT_ID=$VERCEL_API_CACHE_REPRO_PROJECT_ID
  # Set local var to `library` for the `vercel deploy` command below
  PRISMA_CLIENT_ENGINE_TYPE=library
fi

# Make sure schema1 is the current schema
cp ./prisma/schema1.prisma ./prisma/schema.prisma
cat ./prisma/schema.prisma

# Sync the Prisma schema with the db
yarn prisma db push --accept-data-loss

export VERCEL_ORG_ID=$VERCEL_ORG_ID
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "PRISMA_CLIENT_ENGINE_TYPE: $PRISMA_CLIENT_ENGINE_TYPE"

# -------- first deployment --------

# -------- first deployment using --force (= no cache) --------
yarn -s vercel deploy --prod --yes --force --token=$VERCEL_TOKEN --build-env PRISMA_CLIENT_ENGINE_TYPE="$PRISMA_CLIENT_ENGINE_TYPE" --scope=$VERCEL_ORG_ID 1> deployment-url.txt

echo ''
cat deployment-url.txt
DEPLOYED_URL=$( tail -n 1 deployment-url.txt )
DEPLOYED_URL_API=$( tail -n 1 deployment-url.txt )/api
echo ''
echo "Deployed to ${DEPLOYED_URL}"

sleep 10

OUTPUT=$(yarn -s vercel logs $DEPLOYED_URL --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID)
echo "${OUTPUT}"

# Check the Vercel Build Logs for the postinstal hook"
if echo "${OUTPUT}" | grep -q 'prisma generate || true'; then
  echo 'Postinstall hook was added'
else
  echo "Postinstall hook was NOT ADDED"
  # exit 1
fi

# Check the Vercel Build Logs for "Generated Prisma Client"
if echo "${OUTPUT}" | grep -q 'Generated Prisma Client'; then
  echo 'Prisma Client Was Successfully Generated'
else
  echo "Prisma Client Was NOT GENERATED"
  # exit 1
fi

echo '\nFirst deployment using --force (= no cache) - It should succeed:'
curl -H "Accept: application/json" "$DEPLOYED_URL_API"
echo ''

# -------- second deployment --------

# Modify the Prisma schema by commenting out `name  String?`
echo ''
cp ./prisma/schema2.prisma ./prisma/schema.prisma
cat ./prisma/schema.prisma

# Sync the Prisma schema with the db
yarn prisma db push --accept-data-loss

echo ''
# -------- second deployment without --force (= with cache) --------
yarn -s vercel deploy --prod --yes --token=$VERCEL_TOKEN --build-env PRISMA_CLIENT_ENGINE_TYPE="$PRISMA_CLIENT_ENGINE_TYPE" --scope=$VERCEL_ORG_ID 1> deployment-url.txt


cat deployment-url.txt
DEPLOYED_URL=$( tail -n 1 deployment-url.txt )
DEPLOYED_URL_API=$( tail -n 1 deployment-url.txt )/api
echo ''
echo "Deployed to ${DEPLOYED_URL}"

sleep 10

OUTPUT=$(yarn -s vercel logs $DEPLOYED_URL --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID)
echo ''
echo "${OUTPUT}"
echo ''

# Check the Vercel Build Logs for the postinstal hook"
if echo "${OUTPUT}" | grep -q 'prisma generate || true'; then
  echo 'Postinstall hook was added'
else
  echo "Postinstall hook was NOT ADDED"
  # exit 1
fi

# Check the Vercel Build Logs for "Generated Prisma Client"
if echo "${OUTPUT}" | grep -q 'Generated Prisma Client'; then
  echo 'Prisma Client Was Successfully Generated'
else
  echo "Prisma Client Was NOT GENERATED"
  # exit 1
fi

echo '\nSecond deployment without --force (= with cache) - An error is expected:'
curl -H "Accept: application/json" "$DEPLOYED_URL_API"
echo ''
