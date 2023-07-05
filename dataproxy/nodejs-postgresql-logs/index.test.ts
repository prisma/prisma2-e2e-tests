import { test, expect, jest } from '@jest/globals'
import { PrismaClient, Prisma } from '@prisma/client'

test('dataproxy logs with postgres', async () => {
  const prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }],
  })

  const onQuery = jest.fn<(event: Prisma.QueryEvent) => void>()
  prisma.$on('query', onQuery)

  await prisma.user.findMany()

  // Sometimes there's another "SELECT 1" before the actual query we're testing for.
  const lastQueryIndex = onQuery.mock.calls.length - 1

  // See https://github.com/prisma/prisma/issues/18480 regarding trailing space at the end of query.
  expect(onQuery.mock.calls[lastQueryIndex][0].query).toMatchInlineSnapshot(
    `"SELECT "public"."User"."user_id", "public"."User"."email", "public"."User"."name" FROM "public"."User" WHERE 1=1 OFFSET $1 "`,
  )
})
