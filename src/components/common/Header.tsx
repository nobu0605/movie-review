'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState } from 'react'
import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { logout } from '@/features/logout/serverActions/logout'
import { User } from '@/features/user/types/user'

type Props = {
  user: User | null
}

const publicRoutes = ['/login', '/register']

export function Header({ user }: Props) {
  const [_, action, isPending] = useActionState(logout, undefined)
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) return null

  return (
    <header className='h-16 bg-gray-800 text-white flex items-center flex-row-reverse'>
      <div className='mr-6 w-full'>
        <Menubar className='bg-gray-800 border-0 flex justify-between w-full'>
          <div>
            <MenubarMenu>
              <Link href='/'>
                <span className='ml-4'>Movie Review</span>
              </Link>
            </MenubarMenu>
            <MenubarMenu>
              <Link href='/mypage'>
                <span className='ml-4'>Mypage</span>
              </Link>
            </MenubarMenu>
          </div>
          <MenubarMenu>
            <MenubarTrigger>▾ {user?.name}</MenubarTrigger>
            <MenubarContent>
              <form action={action}>
                <button type='submit' disabled={isPending} className='m-2'>
                  Logout
                </button>
              </form>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  )
}
