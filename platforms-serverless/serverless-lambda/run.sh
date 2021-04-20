#!/bin/sh

set -eux

yarn install

yarn prisma generate

yarn tsc

yarn serverless package
ls -l .serverless
less -f .serverless/e2e-tests-serverless-lambda.zip

yarn serverless deploy --region "$AWS_DEFAULT_REGION"
