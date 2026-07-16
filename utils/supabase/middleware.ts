import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Récupérer l'utilisateur de manière sécurisée sur le serveur
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 2. Si l'utilisateur n'est PAS connecté et qu'il tente d'aller sur le /dashboard
  if (!user && url.pathname.startsWith('/dashboard')) {
    // On le redirige vers la page de connexion
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // 3. Optionnel : Si l'utilisateur EST connecté et tente d'aller sur /auth, 
  // on peut le rediriger directement vers le /dashboard
  if (user && url.pathname.startsWith('/auth')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}