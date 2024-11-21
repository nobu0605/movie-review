'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/features/register/serverActions/register'

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, undefined)

  return (
    <form action={action}>
      <div className='flex flex-col gap-2'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' name='name' placeholder='Name' />
        </div>
        {state?.errors?.name && <p className='text-sm text-red-500'>{state.errors.name}</p>}
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
        <div>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input id='confirmPassword' name='confirmPassword' type='password' />
        </div>
        {state?.errors?.confirmPassword && (
          <div className='text-sm text-red-500'>
            <p>confirmPassword must:</p>
            <ul>
              {state.errors.confirmPassword.map((error: string) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <Button aria-disabled={isPending} type='submit' className='mt-2 w-full'>
          {isPending ? 'Submitting...' : 'Register'}
        </Button>
      </div>
    </form>
  )
}
