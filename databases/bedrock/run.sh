#!/bin/sh

set -eux

export DEBUG="*"
export RUST_BACKTRACE=full

yarn install
yarn prisma generate

yarn prisma migrate dev --preview-feature 
