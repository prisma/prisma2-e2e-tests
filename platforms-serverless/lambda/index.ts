const process = require('process');
const execa = require('execa');

const measure_start = process.hrtime.bigint()

import { PrismaClient, Prisma } from '@prisma/client'

const client = new PrismaClient()

const measure_client = process.hrtime.bigint()

function wait(ms: number) {
  var start = Date.now(),
      now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

// TODO check if necessary
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

let pscale: any
try {
  pscale = execa(
    'pscale', ['connect', 'e2e-tests', 'main', '--debug'],
    { env: process.env } // test if required
  )
  pscale.stdout.pipe(process.stdout);
  pscale.catch((err: any) => {
    console.log('pscale connect promise was rejected', err)
  })

  console.log("spawned `pscale connect` successfully")
  wait(3000)
  console.log("and waited 3 seconds for CLI hopefully to open the connection successfully")
} catch (error) {
  console.log('pscale connect error', error)
}

console.log('after pscale stuff')

const measure_planetscale = process.hrtime.bigint()

export async function handler() {
  
  console.log('handler!')

  const measure_handler = process.hrtime.bigint()
  
  try {
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
      measurements: {
        outside_handler: Number(measure_client-measure_start) / 1000000000,
        planetscale:  Number(measure_planetscale-measure_client) / 1000000000,
        inside_handler: Number(measure_end-measure_handler) / 1000000000,
        inside_handler_connect: Number(measure_connect-measure_handler) / 1000000000,
        inside_handler_queries: Number(measure_end-measure_connect) / 1000000000,
        since_environment_start: Number(measure_end-measure_start) / 1000000000,
      }
    }

  } catch (error) {
    console.log('prisma stuff error', error)
  }

  console.log('all done')

  await pscale.catch((err: any) => {
    console.log('(2) pscale connect promise was rejected', err)
  })
  
  console.log('end of the line - lets return this thing')

  return {
    version: Prisma.prismaVersion.client
  }
}
