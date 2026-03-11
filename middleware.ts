import authConfig from '@/auth.config';
import NextAuth from 'next-auth';

import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutePrefixes,
  publicRoutes,
} from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  const isApiRoute = pathname.startsWith('/api');
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(pathname);

  // Keep API routes accessible and let each handler enforce its own auth rules.
  if (isApiRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/sign-in', nextUrl));
  }
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  unstable_allowDynamic: [
    './auth.config.ts',
    '/auth.config.ts',
    './lib/models/user.model.ts',
    '/lib/models/user.model.ts',
    './node_modules/mongoose/dist/browser.umd.js',
    '/node_modules/mongoose/dist/browser.umd.js',
  ],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
