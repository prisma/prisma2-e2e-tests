import { PrismaClient, Prisma } from '@prisma/client'
const execa = require('execa');
require('@janpio/pscale') // for @vercel/nft

function wait(ms) {
  var start = Date.now(),
      now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

const prisma = new PrismaClient()

export default async (req, res) => {

  let pscale
  try {
    pscale = execa(
      'node_modules/@janpio/pscale/pscale', ['connect', 'e2e-tests', 'main', '--debug'],
      { env: process.env } // test if required
    )
    pscale.stdout.pipe(process.stdout);
    pscale.catch((err) => {
      console.log('pscale connect promise was rejected', err)
    })

    console.log("spawned `pscale connect` successfully")
    wait(3000)
    console.log("and waited 3 seconds for CLI hopefully to open the connection successfully")
  } catch (error) {
    console.log('pscale connect error', error)
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const users = await prisma.user.findMany()
  res.status(200).json({
    prismaVersion: Prisma.prismaVersion.client,
    users,
  })
}





