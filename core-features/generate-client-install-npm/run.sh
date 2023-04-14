#!/bin/sh

set -eux

cp ../_common/generate-client-install/* .

npm install
npm remove @prisma/client

npx prisma generate
