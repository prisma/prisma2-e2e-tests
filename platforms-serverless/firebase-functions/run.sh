#!/bin/sh

set -eux

pnpm install

func="e2e_firebase_test_$(date "+%Y_%m_%d_%H%M%S")" # note weird naming here
echo "$func" > func-tmp.txt
echo "$FIREBASE_PRIVATE_KEY" > "./privateKey.json"

# When PRISMA_CLIENT_ENGINE_TYPE is set to `binary`, overwrite existing schema file with one that sets the engineType to 'binary'
if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Using Binary enabled schema"
  cp ./functions/prisma/schema-with-binary.prisma ./functions/prisma/schema.prisma
else
  echo "Using Node-API enabled schema"
  cp ./functions/prisma/schema-with-node-api.prisma ./functions/prisma/schema.prisma
fi

cd functions/ && sh prepare_in_project.sh "$func" && cd ..

pnpm firebase functions:config:set prisma.db="$DATABASE_URL"

GOOGLE_APPLICATION_CREDENTIALS="./privateKey.json" pnpm firebase deploy --only "functions:$func"
