import Link from 'next/link'
import { LoginForm } from '@/features/login/components/LoginForm'

export default function Login() {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex flex-col w-2/5 gap-2.5 h-2 mt-8'>
        <h1 className='text-4xl font-bold text-center'>Login</h1>
        <LoginForm />
        <div className='text-center'>
          <Link href='/register'>register</Link>
        </div>
      </div>
    </div>
  )
}
