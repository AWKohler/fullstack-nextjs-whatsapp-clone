// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
//
// import type { NextRequest } from 'next/server'
//
// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//
//   // Create a Supabase client configured to use cookies
//   const supabase = createMiddlewareClient({ req, res })
//
//   // Refresh session if expired - required for Server Components
//   // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
//   await supabase.auth.getSession()
//
//   return res
// }

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};