#!/bin/sh

set -eux
export DEBUG="*"

DOCKER_PLATFORM_ARCH="linux/arm64"
PRISMA_DOCKER_IMAGE_NAME="prisma-alpine-3.21-node-20-arm64-openssl-3.0.x"

docker buildx build --load \
  --platform="${DOCKER_PLATFORM_ARCH}" \
  --build-context app=. \
  --build-context utils=../../docker/_utils \
  --build-arg DEBUG=${DEBUG} \
  --build-arg PRISMA_TELEMETRY_INFORMATION="${PRISMA_TELEMETRY_INFORMATION}" \
  --build-arg PRISMA_ENGINES_MIRROR=${PRISMA_ENGINES_MIRROR} \
  --build-arg PRISMA_CLIENT_ENGINE_TYPE=${PRISMA_CLIENT_ENGINE_TYPE} \
  --build-arg PRISMA_CLI_QUERY_ENGINE_TYPE=${PRISMA_CLIENT_ENGINE_TYPE} \
  --build-arg CI=${CI} \
  . -t "${PRISMA_DOCKER_IMAGE_NAME}" \
  --progress plain

docker run -p 3000:3000 \
  -e DEBUG=${DEBUG} \
  -e DATABASE_URL=${DATABASE_URL} \
  -e CI=${CI} \
  -e PRISMA_CLIENT_ENGINE_TYPE=${PRISMA_CLIENT_ENGINE_TYPE} \
  -e PRISMA_CLI_QUERY_ENGINE_TYPE=${PRISMA_CLIENT_ENGINE_TYPE} \
  -e PRISMA_TELEMETRY_INFORMATION="${PRISMA_TELEMETRY_INFORMATION}" \
  "${PRISMA_DOCKER_IMAGE_NAME}" &

sleep 15

pnpm install
pnpm prisma generate
