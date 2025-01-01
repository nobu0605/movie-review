'use client'
import { usePathname } from 'next/navigation'
import { useActionState } from 'react'
import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { logout } from '@/features/logout/serverActions/logout'
import { User } from '@/features/user/helpers/user'

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
      <div className='mr-6'>
        <Menubar className='bg-gray-800 border-0'>
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
