import 'server-only'

import { PrismaClient } from '@prisma/client'

const { DATABASE_URL } = process.env
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma // Save Prisma instance in global scope in non-production
}

export default prisma
