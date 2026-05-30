import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/api/db'

const keepAliveSecret = process.env.KEEP_ALIVE_SECRET

function isAuthorized(request: NextRequest) {
  if (!keepAliveSecret) {
    throw new Error('KEEP_ALIVE_SECRET is not defined')
  }

  const authorizationHeader = request.headers.get('authorization')
  const bearerToken = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : null
  const cronSecret = request.headers.get('x-cron-secret')

  return bearerToken === keepAliveSecret || cronSecret === keepAliveSecret
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          error: {
            code: 401,
            message: 'Unauthorized',
          },
        },
        { status: 401 },
      )
    }

    const checkedAt = new Date().toISOString()
    const user = await prisma.user.findFirst({
      select: {
        id: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    console.log('KEEPALIVE_DB_OK', {
      checkedAt,
      hasUser: user !== null,
    })

    return NextResponse.json({
      ok: true,
      db: {
        checked: true,
        hasUser: user !== null,
      },
      timestamp: checkedAt,
    })
  } catch (error) {
    console.error('keepalive failed:', error)

    return NextResponse.json(
      {
        error: {
          code: 500,
          message: 'Internal Server Error',
        },
      },
      { status: 500 },
    )
  }
}
