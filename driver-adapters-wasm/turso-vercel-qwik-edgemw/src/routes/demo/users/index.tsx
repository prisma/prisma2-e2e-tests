import { Prisma, PrismaClient } from '@prisma/client'
import { type RequestHandler } from "@builder.io/qwik-city";
import { getPrisma } from "~/prisma";

const getResult = async (prisma: PrismaClient | Prisma.TransactionClient) => {
  const result = {
    prismaVersion: Prisma.prismaVersion.client,
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
    createMany: await prisma.user.createMany({
      data: [
        {
          email: `test-2@prisma.io`,
          age: 29,
          name: 'Test 2',
        },
        {
          email: `test-3@prisma.io`,
          age: 29,
          name: 'Test 3',
        },
      ],
    }),
    createManyAndReturn: await prisma.user.createManyAndReturn({
      select: {
        age: true,
        email: true,
        name: true,
      },
      data: [
        {
          email: `test-4@prisma.io`,
          age: 30,
          name: 'Test 4',
        },
        {
          email: `test-5@prisma.io`,
          age: 30,
          name: 'Test 5',
        },
        {
          email: `test-6@prisma.io`,
          age: 30,
          name: 'Test 6',
        },
      ],
    }),
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
    updateMany: await prisma.user.updateMany({
      where: {
        age: 26,
      },
      data: {
        age: 27,
      },
    }),
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
      .then(({ _avg }) => ({ age: Math.trunc(_avg.age ?? 0) })),
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

    // Skipping this because of too many sub-requests (limit is 50 per fetch call)

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
  }

  // sort results by email to make the order deterministic
  result.findMany = result.findMany.sort((a, b) => (a.email > b.email ? 1 : -1))

  return result
}

export const onGet: RequestHandler = async ({ json, env }) => {
  const prisma = getPrisma(env)

  const regResult = await getResult(prisma).catch((error) => ({ error_in_regResult: error.message }))
  const itxResult = await prisma.$transaction(getResult).catch((error: Error) => ({ error_in_itxResult: error.message }))

  json(200, { itxResult, regResult })
}