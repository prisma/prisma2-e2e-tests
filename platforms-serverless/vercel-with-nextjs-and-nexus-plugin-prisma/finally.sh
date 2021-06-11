#!/bin/sh

set -eu

yarn vercel logs e2e-vercel-with-nextjs-and-nexus-plugin-prisma.vercel.app --token=$VERCEL_TOKEN --scope=prisma
