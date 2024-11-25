'use server'

import { User } from '@prisma/client'
import { FormState, RegisterFormSchema } from '@/features/register/schema'
import { hashPassword } from '@/utils/api/auth'
import prisma from '@/utils/api/db'
import { createSession } from '@/utils/api/jwt'

export async function register(state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      message: 'Email already exists, please use a different email or login.',
    }
  }

  const hashedPassword = await hashPassword(password)

  const user: User = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  const userId = user.id.toString()
  await createSession(userId)
}
