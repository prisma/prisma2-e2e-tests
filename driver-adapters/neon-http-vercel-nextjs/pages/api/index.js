// @ts-check
const { Prisma, PrismaClient } = require('@prisma/client')
const { neon } = require('@neondatabase/serverless')
const { PrismaNeonHTTP } = require('@prisma/adapter-neon')

const connectionString = process.env.DRIVER_ADAPTERS_NEON_HTTP_VERCEL_NEXTJS_DATABASE_URL

const sql = neon(connectionString)
const adapter = new PrismaNeonHTTP(sql)
const prisma = new PrismaClient({ adapter })

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const getResult = async (prisma) => ({
    prismaVersion: Prisma.prismaVersion.client,
    // Only works since 5.4.0 optimization of the query (because it does not need a transaction anymore)
    deleteMany: await prisma.user.deleteMany().then(() => ({ count: 0 })),
    create: await prisma.user.create({
      data: {
        email: `test-1@prisma.io`,
        age: 27,
        name: 'Test 1',
      },
      select: {
        email: true,
        age: true,
        name: true,
      },
    }),
    // Since `createMany` does not work we add a second create 
    // the record is used for `findUniqueOrThrow(...)` below
    create2: await prisma.user.create({
      data: {
        email: `test-2@prisma.io`,
        age: 29,
        name: 'Test 2',
      }
    }),
    // Expected to fail in HTTP mode
    // createMany: await prisma.user.createMany({
    //   data: [
    //     {
    //       email: `test-2@prisma.io`,
    //       age: 29,
    //       name: 'Test 2',
    //     },
    //     {
    //       email: `test-3@prisma.io`,
    //       age: 29,
    //       name: 'Test 3',
    //     },
    //   ],
    // }),
    // createManyAndReturn: await prisma.user.createManyAndReturn({
    //   select: {
    //     email: true,
    //     name: true,
    //   },
    //   data: [
    //     {
    //       email: `test-4@prisma.io`,
    //       age: 30,
    //       name: 'Test 4',
    //     },
    //     {
    //       email: `test-5@prisma.io`,
    //       age: 30,
    //       name: 'Test 5',
    //     },
    //     {
    //       email: `test-6@prisma.io`,
    //       age: 30,
    //       name: 'Test 6',
    //     },
    //   ],
    // }),
    findMany: await prisma.user.findMany({
      select: {
        email: true,
        age: true,
        name: true,
      },
      orderBy: {
        email: 'asc',
      },
    }),
    findUnique: await prisma.user.findUnique({
      where: {
        email: 'test-1@prisma.io',
      },
      select: {
        email: true,
        age: true,
        name: true,
      },
    }),
    update: await prisma.user.update({
      where: {
        email: 'test-1@prisma.io',
      },
      data: {
        age: 26,
      },
      select: {
        email: true,
        age: true,
        name: true,
      },
    }),
    // updateMany: await prisma.user.updateMany({
    //   where: {
    //     age: 26,
    //   },
    //   data: {
    //     age: 27,
    //   },
    // }),
    findFirst: await prisma.user.findFirst({
      where: {
        age: 27,
      },
      select: {
        email: true,
        age: true,
        name: true,
      },
    }),
    delete: await prisma.user.delete({
      where: {
        email: 'test-1@prisma.io',
      },
      select: {
        email: true,
        age: true,
        name: true,
      },
    }),
    count: await prisma.user.count(),
    aggregate: await prisma.user
      .aggregate({
        _avg: {
          age: true,
        },
      })
      .then(({ _avg }) => ({ age: Math.trunc(_avg?.age ?? 0) })),
    groupBy: await prisma.user.groupBy({
      by: ['age'],
      _count: {
        age: true,
      },
      orderBy: {
        _count: {
          age: 'asc',
        },
      },
    }),
    findFirstOrThrow: await prisma.user.findFirstOrThrow({
      select: {
        age: true,
        email: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    findUniqueOrThrow: await prisma.user.findUniqueOrThrow({
      where: {
        email: 'test-2@prisma.io',
      },
      select: {
        age: true,
        email: true,
        name: true,
      },
    }),
    // upsert: await prisma.user.upsert({
    //   where: {
    //     email: 'test-upsert@prisma.io',
    //   },
    //   create: {
    //     email: 'test-upsert@prisma.io',
    //     age: 30,
    //     name: 'Test upsert',
    //   },
    //   update: {},
    //   select: {
    //     email: true,
    //     age: true,
    //     name: true,
    //   },
    // }),
  })

  const regResult = await getResult(prisma)

  // test the error message when the transaction fails
  try {
    await prisma.user.delete({
      where: {
        email: 'test-1@prisma.io',
      },
    })
  } catch (e) {
    if (e.code !== undefined && e.message !== 'Error: Transactions are not supported in HTTP mode') {
      console.error('The expectation changed and needs to be updated in the test, see new error below:')
      throw e
    }
  }

  // Transactions are expected to fail in HTTP mode
  try {
    const itxResult = await prisma.$transaction(getResult)
  } catch (e) {
    if (e.code !== 'P2036' && e.message !== 'Transactions are not supported in HTTP mode') {
      console.error('The expectation changed and needs to be updated in the test, see new error below:')
      throw e
    }
  }

  const result = {
    // itxResult,
    regResult,
  }

  res.status(200).json(result)
}
