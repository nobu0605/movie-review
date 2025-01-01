'use client'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/features/login/serverActions/login'

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined)

  return (
    <form action={action}>
      <div className='flex flex-col gap-2'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' placeholder='example@gmail.com' />
        </div>
        {state?.errors?.email && <p className='text-sm text-red-500'>{state.errors.email}</p>}
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' name='password' type='password' />
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
      </div>
    </form>
  )
}
