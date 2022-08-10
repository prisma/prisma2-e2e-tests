import { PrismaClient, Prisma } from '@prisma/client'

const client = new PrismaClient()

export async function handler(req: any, res: any) {
  const fs = require('fs')
  const path = require('path')
  const prismaPath = path.dirname(require.resolve('.prisma/client'))
  const files = fs.readdirSync(prismaPath)

  const createUser = await client.user.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })

  const updateUser = await client.user.update({
    where: {
      id: createUser.id,
    },
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
  })

  const users = await client.user.findUnique({
    where: {
      id: createUser.id,
    },
  })

  const deleteUser = await client.user.delete({
    where: { id: createUser.id },
  })

  res.status(200).send({
    version: Prisma.prismaVersion.client,
    createUser,
    updateUser,
    users,
    deleteUser,
    files,
  })
}
