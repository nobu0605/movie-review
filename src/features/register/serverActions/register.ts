'use server'

import { User } from '@prisma/client'
import { FormState, SignupFormSchema } from '@/features/register/schema'
import { hashPassword } from '@/utils/api/auth'
import prisma from '@/utils/api/db'
import { createSession } from '@/utils/api/jwt'

export async function register(state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
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

// export async function login(state: FormState, formData: FormData): Promise<FormState> {
//   // 1. Validate form fields
//   const validatedFields = LoginFormSchema.safeParse({
//     email: formData.get('email'),
//     password: formData.get('password'),
//   })
//   const errorMessage = { message: 'Invalid login credentials.' }

//   // If any form fields are invalid, return early
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     }
//   }

//   // 2. Query the database for the user with the given email
//   const user = await db.query.users.findFirst({
//     where: eq(users.email, validatedFields.data.email),
//   })

//   // If user is not found, return early
//   if (!user) {
//     return errorMessage
//   }
//   // 3. Compare the user's password with the hashed password in the database
//   const passwordMatch = await bcrypt.compare(validatedFields.data.password, user.password)

//   // If the password does not match, return early
//   if (!passwordMatch) {
//     return errorMessage
//   }

//   // 4. If login successful, create a session for the user and redirect
//   const userId = user.id.toString()
//   await createSession(userId)
// }

// export async function logout() {
//   deleteSession()
// }
