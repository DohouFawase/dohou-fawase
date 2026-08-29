import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

export async function updateSession(
  request: NextRequest,
  response?: NextResponse
) {
  let supabaseResponse = response ?? NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          )
          // On repart de la réponse existante (celle de next-intl si fournie)
          // au lieu d'en recréer une nouvelle qui écraserait ses cookies/redirections
          supabaseResponse = response ?? NextResponse.next({ request })
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

  // Le pathname peut contenir un préfixe de locale (/fr/dashboard, /en/auth...)
  // On l'extrait pour comparer indépendamment de la langue.
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)
  const localeMatch = url.pathname.match(localePattern)
  const locale = localeMatch?.[1] ?? routing.defaultLocale
  const pathWithoutLocale = url.pathname.replace(localePattern, '') || '/'

  // 2. Si l'utilisateur n'est PAS connecté et tente d'aller sur /dashboard
  if (!user && pathWithoutLocale.startsWith('/dashboard')) {
    url.pathname = `/${locale}/auth`
    return NextResponse.redirect(url)
  }

  // 3. Si l'utilisateur EST connecté et tente d'aller sur /auth
  if (user && pathWithoutLocale.startsWith('/auth')) {
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}