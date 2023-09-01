const aws = require('aws-sdk')

const lambda = new aws.Lambda({
  region: process.env.AWS_DEFAULT_REGION,
})

jest.setTimeout(30000)

test('prisma version and output', async () => {
  const response = await lambda.invoke({
    FunctionName: 'driver-adapters-postgresql-lambda-basic',
    InvocationType: 'RequestResponse',
    Payload: '""',
  }).promise()

  console.log('response', response)
  console.log('payload', response.Payload.toString('utf-8'))
  console.log('$response', response.$response.data)

  console.log(JSON.parse(response.Payload.toString('utf-8')).body)
  console.log(JSON.parse(JSON.parse(response.Payload.toString('utf-8')).body))

  const { regResult, itxResult } = JSON.parse(response.Payload.toString('utf-8')).body

  expect(regResult).toEqual(itxResult)
  expect(regResult.prismaVersion).toMatch(pjson.dependencies['@prisma/client'])
  expect(regResult.deleteMany.count).toBe(0)
  expect(regResult.create).toMatchInlineSnapshot(`
Object {
  "age": 27,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  expect(regResult.createMany.count).toBe(2)
  expect(regResult.findMany.sort((a, b) => a.email > b.email ? 1 : -1)).toMatchInlineSnapshot(`
Array [
  Object {
    "age": 27,
    "email": "test-1@prisma.io",
    "name": "Test 1",
  },
  Object {
    "age": 29,
    "email": "test-2@prisma.io",
    "name": "Test 2",
  },
  Object {
    "age": 29,
    "email": "test-3@prisma.io",
    "name": "Test 3",
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
  expect(regResult.updateMany.count).toBe(1)
  expect(regResult.findFirst).toMatchInlineSnapshot(`
Object {
  "age": 27,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  expect(regResult.delete).toMatchInlineSnapshot(`
Object {
  "age": 27,
  "email": "test-1@prisma.io",
  "name": "Test 1",
}
`)
  expect(regResult.count).toBe(2)
  expect(regResult.aggregate).toMatchInlineSnapshot(`
Object {
  "age": 29,
}
`)
  expect(regResult.groupBy).toMatchInlineSnapshot(`
Array [
  Object {
    "_count": Object {
      "age": 2,
    },
    "age": 29,
  },
]
`)
  expect(regResult.findFirstOrThrow).toMatchInlineSnapshot(`
Object {
  "age": 29,
  "email": "test-2@prisma.io",
  "name": "Test 2",
}
`)
  expect(regResult.findUniqueOrThrow).toMatchInlineSnapshot(`
Object {
  "age": 29,
  "email": "test-2@prisma.io",
  "name": "Test 2",
}
`)
  expect(regResult.upsert).toMatchInlineSnapshot(`
Object {
  "age": 30,
  "email": "test-4@prisma.io",
  "name": "Test 4",
}
`)
})
