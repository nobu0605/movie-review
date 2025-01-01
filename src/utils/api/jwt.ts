import 'server-only'

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const secret = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : (() => {
      throw new Error('JWT_SECRET is not defined')
    })()
export const tokenMaxAge = 60 * 60 // 1 hour

export const signJwt = async (payload: JWTPayload): Promise<string> => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload')
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret)
}

export const verifyJwt = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, secret)
  return payload as JWTPayload
}

export async function verifySession() {
  try {
    const cookie = await cookies()
    const token = cookie.get('session')?.value || ''
    const session = await verifyJwt(token)
    if (!session?.id) {
      return { isAuth: false }
    }

    return { isAuth: true, userId: Number(session.id) }
  } catch (error) {
    return { isAuth: false }
  }
}

export async function createSession(userId: string) {
  const session = await signJwt({ id: userId })
  const cookie = await cookies()
  cookie.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: tokenMaxAge,
    path: '/',
  })

  await redirect('/')
}

export async function deleteSession() {
  const cookie = await cookies()
  cookie.delete('session')
  await redirect('/login')
}
