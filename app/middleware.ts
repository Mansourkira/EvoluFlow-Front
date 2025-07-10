import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from "next/server";
 
let locales = ['en', 'fr']
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request) {  }
 
export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)

}
export const config = {
matcher: ['/', `/(api|assets|images|videos|icons|next-intl|_next|.*\\..*)$`, '/([a-z]{2})/']
// Le matcher le plus simple pour commencer :
//    matcher: ['/((?!api|_next|.*\\..*).*)'] 
}


let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let defaultLocale = 'fr'
 
match(languages, locales, defaultLocale) // -> 'fr' 


export default createMiddleware(routing);
 
