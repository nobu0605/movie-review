'use server'

import { deleteSession } from '@/utils/api/jwt'

export async function logout() {
  await deleteSession()
}
