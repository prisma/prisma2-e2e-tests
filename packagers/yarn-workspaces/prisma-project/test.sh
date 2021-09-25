#!/bin/sh

set -eux

yarn prisma generate
yarn ts-node ./script.ts
