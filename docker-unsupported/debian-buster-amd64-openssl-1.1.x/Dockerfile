# syntax=docker/dockerfile:1

FROM node:lts-buster-slim

WORKDIR /usr/src/app
COPY --from=app . ./
COPY --from=utils . ./

# Update system dependencies.
RUN apt-get update -y

# expected target architecture, retrieved by `uname -m`
ARG EXPECTED_UNAME_ARCH="x86_64"
ENV EXPECTED_UNAME_ARCH=$EXPECTED_UNAME_ARCH
RUN ./uname.sh

# OpenSSL is missing in the base image
# RUN ldconfig -p | grep ssl
# RUN if [ ! -e /usr/lib/${EXPECTED_UNAME_ARCH}-linux-gnu/libssl.so.1.1* ]; then echo "OpenSSL 1.1 not found in /usr/lib/${EXPECTED_UNAME_ARCH}-linux-gnu/libssl.so.1.1*"; exit 1; fi
# RUN if [ -e /usr/lib/${EXPECTED_UNAME_ARCH}-linux-gnu/libssl.so.3* ]; then echo "OpenSSL 3 must not be installed (found in /usr/lib/${EXPECTED_UNAME_ARCH}-linux-gnu/libssl.so.3*)"; exit 1; fi

# expected target platform for Prisma, retrieved by `prisma -v`.
ARG EXPECTED_PRISMA_TARGET_PLATFORM="debian-openssl-1.1.x"
ARG PRISMA_ENGINES_MIRROR
ARG PRISMA_CLIENT_ENGINE_TYPE
ARG PRISMA_CLI_QUERY_ENGINE_TYPE
ARG CI
ARG DEBUG
ARG PRISMA_TELEMETRY_INFORMATION

ENV PRISMA_ENGINES_MIRROR=$PRISMA_ENGINES_MIRROR
ENV PRISMA_CLIENT_ENGINE_TYPE=$PRISMA_CLIENT_ENGINE_TYPE
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=$PRISMA_CLI_QUERY_ENGINE_TYPE
ENV CI=$CI
ENV DEBUG=$DEBUG
ENV PRISMA_TELEMETRY_INFORMATION=$PRISMA_TELEMETRY_INFORMATION
ENV EXPECTED_PRISMA_TARGET_PLATFORM=$EXPECTED_PRISMA_TARGET_PLATFORM

RUN npm i -g pnpm@8
RUN pnpm install

# This will fail with:
# Error: Unable to require(`/usr/src/app/node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node`)
#   libssl.so.1.1: cannot open shared object file: No such file or directory
RUN ./version.sh

RUN pnpm prisma generate

CMD node server.js
EXPOSE 3000
