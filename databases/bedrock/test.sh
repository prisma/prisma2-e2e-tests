#!/bin/sh

set -eu

export DEBUG="*"
export RUST_BACKTRACE=full

yarn cmd
yarn prisma introspect

