#!/bin/sh

set -eux

# this just verifies environment variables are set
x="$AWS_DEFAULT_REGION"
x="$AWS_ACCESS_KEY_ID"
x="$AWS_SECRET_ACCESS_KEY"
x="$AWS_ROLE"

pnpm install
pnpm prisma generate
pnpm tsc

rm -rf lambda.zip
zip --symlinks -r lambda.zip index.js prisma/schema.prisma node_modules/@prisma/client node_modules/.pnpm/@prisma+client*
du -b ./lambda.zip

AWS_RUNTIME=nodejs18.x
AWS_RUNTIME_VERSION=18

# https://docs.aws.amazon.com/cli/latest/reference/lambda/

# Commented out since this only needs to happen when the function needs to be created (e.g. if its name changes)
# aws lambda create-function \
#     --function-name "platforms-serverless-lambda-node-$AWS_RUNTIME_VERSION-$PRISMA_CLIENT_ENGINE_TYPE" \
#     --runtime $AWS_RUNTIME \
#     --zip-file "fileb://lambda.zip" \
#     --role arn:aws:iam::275927176912:role/prisma-e2e-all \
#     --handler index.handler \
#     --description "Testing Lambda deployment and runtime from https://github.com/prisma/ecosystem-tests/"

aws lambda update-function-configuration \
    --function-name "platforms-serverless-lambda-node-$AWS_RUNTIME_VERSION-$PRISMA_CLIENT_ENGINE_TYPE" \
    --runtime $AWS_RUNTIME \
    --environment "Variables={DATABASE_URL=$DATABASE_URL}" \
    --timeout 10

aws lambda update-function-code \
    --function-name "platforms-serverless-lambda-node-$AWS_RUNTIME_VERSION-$PRISMA_CLIENT_ENGINE_TYPE" \
    --zip-file "fileb://lambda.zip"
