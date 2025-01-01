import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/common/Layout'

export const metadata: Metadata = {
  title: 'Movie Reviews',
  description: 'Movie Reviews',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
