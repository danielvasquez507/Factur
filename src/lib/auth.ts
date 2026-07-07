import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { rateLimit } from "./rate-limit"
import bcrypt from "bcryptjs"
import { authConfig } from "../auth.config"

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

        const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim()
          || request?.headers?.get("x-real-ip")
          || "unknown"
        const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
        if (!rl.success) {
          return null
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
          return null
        }

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
