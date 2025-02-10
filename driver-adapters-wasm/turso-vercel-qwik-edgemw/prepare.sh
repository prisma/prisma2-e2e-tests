#!/usr/bin/env bash

export PRISMA_TELEMETRY_INFORMATION='ecosystem-tests driver-adapters-wasm turso-vercel-qwik-edgemw build'
export PRISMA_CLIENT_ENGINE_TYPE='wasm' # because setup otherwise makes it library/binary
