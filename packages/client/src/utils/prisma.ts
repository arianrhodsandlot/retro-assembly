import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { env } from 'hono/adapter'
import { getHonoContext } from 'waku/unstable_hono'

export function createPrisma() {
  const c = getHonoContext()
  const { DB } = env<{ DB: any }>(c, 'workerd')
  const adapter = new PrismaD1(DB)
  const prisma = new PrismaClient({ adapter })
  return prisma
}
