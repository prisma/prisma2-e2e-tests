import { test, expect, jest } from '@jest/globals'
import { PrismaClient, Prisma } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

test('accelerate logs with mongodb', async () => {
  const prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }],
  })

  let xprisma = prisma

  if (process.env.DATAPROXY_FLAVOR === 'DP2+Extension') {
    xprisma = xprisma.$extends(withAccelerate()) as any
  }

  const onQuery = jest.fn<(event: Prisma.QueryEvent) => void>()
  prisma.$on('query', onQuery)

  await xprisma.user.findMany({
    // `take` was added to avoid the error `P6009`, thrown when the response size of
    // the query exceeded the the maximum of 5MB.
    take: 10,
  })

  const lastQueryIndex = onQuery.mock.calls.length - 1
  expect(onQuery.mock.calls[lastQueryIndex][0].query).toMatchInlineSnapshot(
    `"db.User.aggregate([ { $sort: { _id: 1, }, }, { $limit: 10, }, { $project: { _id: 1, email: 1, name: 1, val: 1, }, }, ])"`,
  )
})
