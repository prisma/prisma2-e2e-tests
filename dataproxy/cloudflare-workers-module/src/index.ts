// Note: see wrangler.toml and https://www.npmjs.com/package/@cloudflare/workers-types for the version
/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from '@prisma/client/edge'

export interface Env {
  CLOUDFLARE_DATA_PROXY_URL: string
}

let prisma: PrismaClient

export default {
  fetch(request: Request, env: Env) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: env.CLOUDFLARE_DATA_PROXY_URL,
        },
      },
    })

    return getUsers()
  },
}

async function getUsers() {
  console.debug(new Date(), 'Start await prisma.$transaction')
  console.time('transactionTook')
  const data = await prisma.$transaction([prisma.user.findFirst(), prisma.user.findMany()])
  console.timeEnd('transactionTook')
  console.debug(new Date(), 'End await prisma.$transaction')

  const json = JSON.stringify({ data })

  return new Response(json, {
    status: 200,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}
