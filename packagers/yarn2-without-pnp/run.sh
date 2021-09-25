#!/bin/sh

set -eu

# Set Yarn to Berry (latest Yarn 2 version known to Yarn 1)
yarn set version berry

# Set nodeLinker to node-modules
yarn config set nodeLinker node-modules

# To avoid this error 
# YN0028: │ The lockfile would have been modified by this install, which is explicitly forbidden.
YARN_ENABLE_IMMUTABLE_INSTALLS=0 yarn install

yarn prisma generate
