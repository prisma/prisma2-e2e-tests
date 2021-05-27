#!/bin/sh

set -eux

rm -rf node_modules
yarn install --production

rm -rf lambda.zip

rm -rf node_modules/prisma
rm -rf node_modules/@prisma/engines
rm -rf node_modules/typescript

zip -r lambda.zip index.js prisma/schema.prisma node_modules/.prisma node_modules/** pscale

du -b ./lambda.zip
