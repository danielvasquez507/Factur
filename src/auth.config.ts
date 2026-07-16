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
      const isLandingPage = nextUrl.pathname === '/'
      const isApiRoute = nextUrl.pathname.startsWith('/api')

      if (isLoggedIn && (isLoginPage || isLandingPage)) {
        return Response.redirect(new URL('/panel', nextUrl))
      }

      if (isLoginPage || isApiRoute || isLandingPage) return true

      if (!isLoggedIn) return false

      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
    updateAge: 60 * 60, // Refresca el token cada hora si hay actividad
  },
  trustHost: true,
  providers: [], // Providers are added in lib/auth.ts
} satisfies NextAuthConfig
