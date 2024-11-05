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
    // Workaround for "This request could not be understood by the server" error:
    // ```json
    // {
    //   "type": "UnknownJsonError",
    //   "body": {
    //     "code": "P6009",
    //     "message": "The response size of the query exceeded the the maximum of 5MB with 7.17MB.
    //                 Consider refining the query by narrowing the selection set or applying appropriate filters.
    //                 This limit is configurable, see pris.ly/configure-limits for more information."
    //   }
    // }
    // ```
    limit: 10,
  })

  const lastQueryIndex = onQuery.mock.calls.length - 1
  expect(onQuery.mock.calls[lastQueryIndex][0].query).toMatchInlineSnapshot(
    `"db.User.aggregate([ { $project: { _id: 1, email: 1, name: 1, val: 1, }, }, ])"`,
  )
})
