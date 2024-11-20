'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/features/register/serverActions/register'

export function RegisterForm() {
  const [state, action] = useActionState(register, undefined)

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
        <RegisterButton />
      </div>
    </form>
  )
}

export function RegisterButton() {
  const { pending } = useFormStatus()

  return (
    <Button aria-disabled={pending} type='submit' className='mt-2 w-full'>
      {pending ? 'Submitting...' : 'Register'}
    </Button>
  )
}
