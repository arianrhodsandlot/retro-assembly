import pkg from '@prisma/client'

const { PrismaClient }= pkg
const prisma = new PrismaClient()

// await prisma.game.create({ data: {} })
const result = await prisma.game.count()
console.log(result)
