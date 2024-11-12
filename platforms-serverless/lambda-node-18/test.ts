import { Prisma } from '@prisma/client'
import { invokeLambdaSync } from './utils'
const process = require('process')

const name = `platforms-serverless-lambda-node-16-${process.env.PRISMA_CLIENT_ENGINE_TYPE}`

async function main() {
  console.log('testing function', name)
  const measure_start = process.hrtime.bigint()
  const data = await invokeLambdaSync(name, '')
  const measure_end = process.hrtime.bigint()
  console.log('function invocation duration:', Number(measure_end - measure_start) / 1000000000)

  console.log({ data: data.$response.data })

  let original = JSON.parse((data.$response.data as any).Payload)
  console.log('original', original)
  delete original.measurements
  const actual = JSON.stringify(original)
  console.log('actual', actual)
  // TODO Update to only expect on engine file after zip script was updated
  let files = `,"files":["default.d.ts","default.js","deno","edge.d.ts","edge.js","index-browser.js","index.d.ts","index.js","libquery_engine-debian-openssl-1.1.x.so.node","libquery_engine-rhel-openssl-1.0.x.so.node","package.json","schema.prisma","wasm.d.ts","wasm.js"]`
  if (process.env.PRISMA_CLIENT_ENGINE_TYPE === 'binary') {
    files = `,"files":["default.d.ts","default.js","deno","edge.d.ts","edge.js","index-browser.js","index.d.ts","index.js","package.json","query-engine-debian-openssl-1.1.x","query-engine-rhel-openssl-1.0.x","schema.prisma","wasm.d.ts","wasm.js"]`
  }

  const expect =
    '{"version":"' +
    Prisma.prismaVersion.client +
    `","createUser":{"id":"12345","email":"alice@prisma.io","name":"Alice"},"updateUser":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"users":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"deleteManyUsers":{"count":1}${files}}`

  if (actual !== expect) {
    console.log('Expected: \n', expect, '\nBut got:\n', actual)
    process.exit(1)
  }

  console.log('test succeeded')
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
