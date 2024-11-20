import { RegisterForm } from '@/features/register/components/RegisterForm'

export default function Register() {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex flex-col w-2/5 gap-2.5 h-2 mt-8'>
        <h1 className='text-4xl font-bold text-center'>Register</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
