import { User } from '@/features/user/types/user'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

export async function getUser(): Promise<User | null> {
  const session = await verifySession()
  if (!session.isAuth) return null

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: session.userId,
    },
  })

  return user
}
