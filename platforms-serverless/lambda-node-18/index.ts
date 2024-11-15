const process = require('process');

const measure_start = process.hrtime.bigint()

import { PrismaClient, Prisma } from '@prisma/client'

const client = new PrismaClient()

const measure_client = process.hrtime.bigint()

export async function handler() {
  const fs = require('fs')
  const path = require('path')
  const generatedClientDir = path.dirname(require.resolve('.prisma/client', {
    paths: [require.resolve('@prisma/client')]
  }))
  const files = fs.readdirSync(generatedClientDir)

  const measure_handler = process.hrtime.bigint()

  await client.$connect()

  const measure_connect = process.hrtime.bigint()

  await client.user.deleteMany({})

  const id = '12345'

  const createUser = await client.user.create({
    data: {
      id,
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })

  const updateUser = await client.user.update({
    where: {
      id,
    },
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
  })

  const users = await client.user.findUnique({
    where: {
      id,
    },
  })

  const deleteManyUsers = await client.user.deleteMany({})

  const measure_end = process.hrtime.bigint()

  return {
    version: Prisma.prismaVersion.client,
    createUser,
    updateUser,
    users,
    deleteManyUsers,
    files,
    measurements: {
      outside_handler: Number(measure_client-measure_start) / 1000000000,
      inside_handler: Number(measure_end-measure_handler) / 1000000000,
      inside_handler_connect: Number(measure_connect-measure_handler) / 1000000000,
      inside_handler_queries: Number(measure_end-measure_connect) / 1000000000,
      since_environment_start: Number(measure_end-measure_start) / 1000000000,
    }
  }
}
