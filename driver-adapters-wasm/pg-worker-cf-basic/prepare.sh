#!/usr/bin/env bash

export PRISMA_TELEMETRY_INFORMATION='ecosystem-tests driver-adapters-wasm pg-cf-basic build'
export PRISMA_CLIENT_ENGINE_TYPE='wasm' # because setup otherwise makes it library/binary

cp -fr wrangler.base.toml wrangler.toml # needed for retries
echo "DATABASE_URL=\"$DATABASE_URL\"" >> wrangler.toml

