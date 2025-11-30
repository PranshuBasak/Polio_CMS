import { createClient } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Proxy function for Next.js 16
 * Handles Supabase authentication and route protection
 */
export async function proxy(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    // Refresh session by calling getUser
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Proxy auth error:', error)
    }

    // Protect /admin routes - redirect to login if no user
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Return the response with updated cookies
    return response
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.next()
  }
}

// Configure which routes to run proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
