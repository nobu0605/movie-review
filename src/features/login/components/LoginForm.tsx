'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/features/login/serverActions/login'

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined)
  const [showDemoAccount, setShowDemoAccount] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function setDemoAccount() {
    setEmail('demo.account@gmail.com')
    setPassword('b#ET]Zn3hx')
  }

  return (
    <form action={action}>
      <div className='flex flex-col gap-2'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            placeholder='example@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {state?.errors?.email && <p className='text-sm text-red-500'>{state.errors.email}</p>}
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {state?.errors?.password && (
          <div className='text-sm text-red-500'>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error: string) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <span className='text-sm text-red-500'>{state?.message}</span>
        <Button aria-disabled={isPending} type='submit' className='mt-2 w-full'>
          {isPending ? 'Submitting...' : 'Login'}
        </Button>
        <div className='text-center'>
          <Link href='/register'>register</Link>
        </div>
        <div>
          <span className='cursor-pointer' onClick={() => setShowDemoAccount(!showDemoAccount)}>
            Demo account
            <span className='text-[10px] ml-[3px]'>▼</span>
          </span>
          {showDemoAccount && (
            <div className='w-[300px]'>
              <button
                type='submit'
                className='bg-transparent text-sm p-2 border rounded'
                onClick={() => setDemoAccount()}
              >
                Login with demo account
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
