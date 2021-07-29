#!/bin/sh

set -eux

func="e2e_firebase_test_$(date "+%Y_%m_%d_%H%M%S")" # note weird naming here
echo "$func" > func-tmp.txt

# When PRISMA_CLIENT_ENGINE_TYPE is set to `binary`, overwrite existing schema file with one that sets the engineType to 'binary'
if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  cp ./functions/prisma/schema-with-binary.prisma ./functions/prisma/schema.prisma
else
  # use the default schema at prisma/schema.prisma file
  true
fi

cd functions/ && sh prepare_in_project.sh "$func" && cd ..

firebase functions:config:set prisma.db="$DATABASE_URL"

firebase deploy --token "$FIREBASE_TOKEN" --only "functions:$func"
