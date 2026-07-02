import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/',
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
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isRoot = nextUrl.pathname === '/'

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to login
      } else if (isLoggedIn && isRoot) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      
      // Bloquear acceso al resto si no está autenticado, excepto login y api
      if (!isLoggedIn && !isRoot && !nextUrl.pathname.startsWith('/api')) {
          return false
      }
      
      return true
    },
  },
  providers: [], // Providers are added in lib/auth.ts
} satisfies NextAuthConfig
