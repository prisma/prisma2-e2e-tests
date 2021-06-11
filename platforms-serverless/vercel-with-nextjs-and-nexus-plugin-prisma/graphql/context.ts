import type { PrismaClient } from '@prisma/client'
import { prisma } from '../lib/prisma'

export interface Context {
  prisma: PrismaClient
}

export const createContext = async (): Promise<Context> => {

  return { prisma }
}
