#!/bin.sh

set -eux

sh zip.sh

# multiple env vars in 1 call, not multiple calls!
aws lambda update-function-configuration --function-name prisma2-e2e-tests --environment "Variables={PLANETSCALE_ORG=$PLANETSCALE_ORG,PLANETSCALE_SERVICE_TOKEN_NAME=$PLANETSCALE_SERVICE_TOKEN_NAME,PLANETSCALE_SERVICE_TOKEN=$PLANETSCALE_SERVICE_TOKEN}" --timeout 10

aws lambda update-function-code --function-name prisma2-e2e-tests --zip-file "fileb://lambda.zip"
yarn install
