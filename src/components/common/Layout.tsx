import { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from '@/components/common/Header'
import { getUser } from '@/features/user/helpers/user'

type Props = {
  children: ReactNode
}

export async function Layout({ children }: Props) {
  const user = await getUser()

  return (
    <div>
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
