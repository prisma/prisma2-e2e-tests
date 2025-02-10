import { createClient as createTursoClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import type { EnvGetter } from '@builder.io/qwik-city/middleware/request-handler';

export function getPrisma(env: EnvGetter) {
  const connectionString = `${env.get("DRIVER_ADAPTERS_TURSO_VERCEL_QWIK_EDGEMW_DATABASE_URL")}`;
  const token = `${env.get("DRIVER_ADAPTERS_TURSO_VERCEL_QWIK_EDGEMW_TOKEN")}`;

  const turso = createTursoClient({
    url: connectionString,
    authToken: token,
  });
  const adapter = new PrismaLibSQL(turso);
  const prisma = new PrismaClient({ adapter });

  return prisma;
}
