#!/bin/sh

set -eux

# 1. Deploy the project with the initial schema

cp script1.sh script.sh
cp index1.test.js index.test.js
cp pages/api/index1.js pages/api/index.js
cp prisma/schema1.prisma prisma/schema.prisma
pnpm prisma db push --force-reset # clean it

pnpm vercel deploy \
--prod \
--yes \
--force \
--token="$VERCEL_TOKEN" \
--env DATABASE_URL="$DATABASE_URL" \
--build-env DEBUG="prisma:*" \
--build-env PRISMA_CLIENT_ENGINE_TYPE="$PRISMA_CLIENT_ENGINE_TYPE" \
--scope="$VERCEL_ORG_ID" \
1> deployment-url.txt \

cat deployment-url.txt
DEPLOYED_URL=$(tail -n 1 deployment-url.txt)
echo "Deployed to ${DEPLOYED_URL}"

sleep 15

pnpm test index.test

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Binary"
  OUTPUT=$(pnpm vercel logs e2e-vercel-with-nextjs-caching-binary.vercel.app --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID")
else
  echo "Library (Default)"
  OUTPUT=$(pnpm vercel logs e2e-vercel-with-nextjs-caching.vercel.app --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID")
fi

# Check the Vercel Build Logs for "We have detected that..."
if echo "${OUTPUT}" | grep -q "We have detected that you've built your project on Vercel, which caches dependencies."; then
  echo "Prisma Client caching error was NOT THROWN 🛑"
  exit 1
else
  echo "Prisma Client caching error was THROWN ✅"
fi


# 2. Deploy the project with the updated schema

cp script2.sh script.sh
cp index2.test.js index.test.js
cp pages/api/index2.js pages/api/index.js
cp prisma/schema2.prisma prisma/schema.prisma
pnpm prisma db push # don't reset the db

# don't force deploy, we want to test the caching
pnpm vercel deploy \
--prod \
--yes \
--token="$VERCEL_TOKEN" \
--env DATABASE_URL="$DATABASE_URL" \
--build-env DEBUG="prisma:*" \
--build-env PRISMA_CLIENT_ENGINE_TYPE="$PRISMA_CLIENT_ENGINE_TYPE" \
--scope=$VERCEL_ORG_ID \
1> deployment-url.txt \

cat deployment-url.txt
DEPLOYED_URL=$(tail -n 1 deployment-url.txt)
echo "Deployed to ${DEPLOYED_URL}"

sleep 15

pnpm test index.test

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Binary"
  OUTPUT=$(pnpm vercel logs e2e-vercel-with-nextjs-caching-binary.vercel.app --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID")
else
  echo "Library (Default)"
  OUTPUT=$(pnpm vercel logs e2e-vercel-with-nextjs-caching.vercel.app --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID")
fi

# Check the Vercel Build Logs for "We have detected that..."
if echo "${OUTPUT}" | grep -q "We have detected that you've built your project on Vercel, which caches dependencies."; then
  echo "Prisma Client caching error was THROWN 🛑"
  exit 1
else
  echo "Prisma Client caching error was NOT THROWN ✅"
fi
