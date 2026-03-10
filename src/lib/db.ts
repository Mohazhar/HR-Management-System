import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  }).$extends(withAccelerate())
}

declare global {
  var prisma_v2: undefined | ReturnType<typeof prismaClientSingleton>
}

export const db = globalThis.prisma_v2 ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma_v2 = db