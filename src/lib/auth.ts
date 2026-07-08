import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { validateLoginAttempt, recordFailedLogin, recordSuccessfulLogin } from "@/actions/auth-actions"
import bcrypt from "bcryptjs"
import { CredentialsSignin } from "next-auth"
import { authConfig } from "../auth.config"

class CustomAuthError extends CredentialsSignin {
  code: string
  constructor(message: string) {
    super()
    this.code = message
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Validate lock status before password check
        const validation = await validateLoginAttempt(credentials.email as string)
        if (validation.error) {
          throw new CustomAuthError(validation.error)
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          const failRes = await recordFailedLogin(credentials.email as string)
          throw new CustomAuthError(failRes.error || "Credenciales incorrectas")
        }

        await recordSuccessfulLogin(credentials.email as string)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
})
