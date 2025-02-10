import { createRequire } from "node:module";
const { PrismaClient } = createRequire(import.meta.url)("./prisma/client/edge");
import { PrismaNeon } from "npm:@prisma/adapter-neon"
import { Pool } from 'npm:@neondatabase/serverless'

const client = new Pool({ connectionString: "postgresql://mills:bc6Gyme0QWAS@ep-crimson-queen-10606038.us-east-2.aws.neon.tech/mydb?sslmode=require" })
const adapter = new PrismaNeon(client)
const prisma = new PrismaClient({ adapter })

export default async (request, context) => {
  const data = await prisma.user.findMany({});

  return Response.json(JSON.stringify(data));
};

export const config = {
  path: "/json",
};
