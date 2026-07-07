import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === '/login'
      const isApiRoute = nextUrl.pathname.startsWith('/api')

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/', nextUrl))
      }

      if (isLoginPage || isApiRoute) return true

      if (!isLoggedIn) return false

      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [], // Providers are added in lib/auth.ts
} satisfies NextAuthConfig
