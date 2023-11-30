// @ts-check
const { test, expect, jest } = require('@jest/globals')
const { dependencies } = require('./package.json')
const fetch = require('node-fetch').default

jest.setTimeout(30_000)

test('prisma version and output', async () => {
  const response = await fetch(process.env.DEPLOYMENT_URL + '/')
  const { regResult, itxResult } = await response.json()

  // Error: Transactions are not supported in HTTP mode
  // The expectations that need transactions behind the scene are commented out
  // Except the interactive transaction (itxResult) at the end

  // expect(regResult).toEqual(itxResult)
  expect(regResult.prismaVersion).toMatch(dependencies['@prisma/client'])
  expect(regResult.deleteMany.count).toBe(0)
  expect(regResult.create).toMatchInlineSnapshot(`
Object {
  "age": 27,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  // expect(regResult.createMany.count).toBe(2)
  expect(regResult.findMany).toMatchInlineSnapshot(`
Array [
  Object {
    "age": 27,
    "email": "test-1@prisma.io",
    "name": "Test 1",
  },
]
`)
  expect(regResult.findUnique).toMatchInlineSnapshot(`
Object {
  "age": 27,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  expect(regResult.update).toMatchInlineSnapshot(`
Object {
  "age": 26,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  // expect(regResult.updateMany.count).toBe(1)
  expect(regResult.findFirst).toMatchInlineSnapshot(`null`)
  //   expect(regResult.delete).toMatchInlineSnapshot(`
  // Object {
  //   "age": 27,
  //   "email": "test-1@prisma.io",
  //   "name": "Test 1",
  // }
  // `)
  expect(regResult.count).toBe(1)
  expect(regResult.aggregate).toMatchInlineSnapshot(`
Object {
  "age": 26,
}
`)
  expect(regResult.groupBy).toMatchInlineSnapshot(`
Array [
  Object {
    "_count": Object {
      "age": 1,
    },
    "age": 26,
  },
]
`)
  expect(regResult.findFirstOrThrow).toMatchInlineSnapshot(`
Object {
  "age": 26,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  expect(regResult.findUniqueOrThrow).toMatchInlineSnapshot(`
Object {
  "age": 26,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  //   expect(regResult.upsert).toMatchInlineSnapshot(`
  // Object {
  //   "age": 30,
  //   "email": "test-4@prisma.io",
  //   "name": "Test 4",
  // }
  // `)
})