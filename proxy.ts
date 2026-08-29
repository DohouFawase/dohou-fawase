import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
const handleI18nRouting = createMiddleware(routing);
export async function proxy(request: NextRequest) {
   const intlResponse = handleI18nRouting(request);
  return await updateSession(request, intlResponse)
}

export const config = {
  matcher: [
    /*
     * On applique le middleware sur toutes les routes sauf :
     * - les fichiers statiques (_next/static, _next/image, favicon.ico)
     * - les images (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}