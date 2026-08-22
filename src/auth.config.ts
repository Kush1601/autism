import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
      const isDashboardPage = nextUrl.pathname.startsWith("/dashboard") || 
                              nextUrl.pathname.startsWith("/screening") || 
                              nextUrl.pathname.startsWith("/results") ||
                              nextUrl.pathname.startsWith("/chatbot") ||
                              nextUrl.pathname.startsWith("/monitoring") ||
                              nextUrl.pathname.startsWith("/therapy");

      if (isDashboardPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      } else if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [], // Empty array, we'll add providers in auth.ts
} satisfies NextAuthConfig;
