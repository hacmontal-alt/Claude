import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Skip auth check if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
  const isOnboarding = request.nextUrl.pathname.startsWith('/onboarding') || request.nextUrl.pathname.startsWith('/dashboard');
  const isAppPage = request.nextUrl.pathname.startsWith('/overview') || request.nextUrl.pathname.startsWith('/prompts') || request.nextUrl.pathname.startsWith('/sources') || request.nextUrl.pathname.startsWith('/opportunities') || request.nextUrl.pathname.startsWith('/content') || request.nextUrl.pathname.startsWith('/earned') || request.nextUrl.pathname.startsWith('/impact') || request.nextUrl.pathname.startsWith('/research') || request.nextUrl.pathname.startsWith('/settings');
  const isPublicPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/agency-directory');

  // Allow onboarding and dashboard without auth (for demo/trial flow)
  if (!user && isAppPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/overview';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
