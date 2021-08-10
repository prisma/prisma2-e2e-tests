import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export async function main() {
  await client.user.deleteMany({})

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

  const deleteManyUsers = await client.user.deleteMany()

  return { createUser, updateUser, users, deleteManyUsers }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .then((data) => {
    console.log(JSON.stringify(data))
  })
  .finally(() => client.$disconnect())
