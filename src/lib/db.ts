import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  })
}

declare global {
  var prisma_v2: undefined | ReturnType<typeof prismaClientSingleton>
}

export const db = globalThis.prisma_v2 ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma_v2 = db