import pkg from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

console.log(env)

export default {
  async fetch(request, env) {
    const { PrismaClient } = pkg
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    const c = await prisma.rom.count()

    return new Response(
      c
    );
  },
};
