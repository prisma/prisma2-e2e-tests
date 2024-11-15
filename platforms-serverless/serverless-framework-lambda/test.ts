import { Prisma } from '@prisma/client'
import { invokeLambdaSync } from './utils'

// name cannot be too long, otherwise it will fail
const name = `platforms-serverless-slsf-${process.env.PRISMA_CLIENT_ENGINE_TYPE}`

async function main() {
  console.log('testing function', name)
  const data = await invokeLambdaSync(name, '')
  console.log({ data: data.$response.data })

  const actual = (data.$response.data as any).Payload
  const binaryString = process.env.PRISMA_CLIENT_ENGINE_TYPE === 'binary'
    ? `,"files":["default.d.ts","default.js","deno","edge.d.ts","edge.js","index-browser.js","index.d.ts","index.js","package.json","query-engine-rhel-openssl-3.0.x","schema.prisma","wasm.d.ts","wasm.js"]`
    : `,"files":["default.d.ts","default.js","deno","edge.d.ts","edge.js","index-browser.js","index.d.ts","index.js","libquery_engine-rhel-openssl-3.0.x.so.node","package.json","schema.prisma","wasm.d.ts","wasm.js"]`
  const expect = `{"version":"${Prisma.prismaVersion.client}","createUser":{"id":"12345","email":"alice@prisma.io","name":"Alice"},"updateUser":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"users":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"deleteManyUsers":{"count":1}${binaryString}}`

  if (actual !== expect) {
    console.log('Expected: \n', expect, '\nBut Got:\n', actual)
    process.exit(1)
  }

  console.log('test succeeded')
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
