import { createClient } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Proxy function for Next.js 16
 * Handles Supabase authentication and route protection
 */
export async function proxy(request: NextRequest) {
  try {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    if (!isAdminRoute) {
      return NextResponse.next();
    }

    const { supabase, response } = createClient(request)

    // Refresh session by calling getUser
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      const isExpectedAnonymousSessionMissing =
        error.name === 'AuthSessionMissingError' ||
        error.message?.toLowerCase().includes('auth session missing');

      if (!isExpectedAnonymousSessionMissing) {
        console.error('Proxy auth error:', error);
      }
    }

    // Protect /admin routes - redirect to login if no user
    if (!user) {
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
  matcher: ['/admin/:path*'],
}
