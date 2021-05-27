#!/bin/sh

set -eux

# this just verifies environment variables are set
x="$LAMBDA_PG_URL"
x="$AWS_DEFAULT_REGION"
x="$AWS_ACCESS_KEY_ID"
x="$AWS_SECRET_ACCESS_KEY"
x="$AWS_ROLE"

x="$PLANETSCALE_ORG"
x="$PLANETSCALE_SERVICE_TOKEN_NAME"
x="$PLANETSCALE_SERVICE_TOKEN"

yarn install

yarn prisma generate

yarn tsc

sh update-code.sh
