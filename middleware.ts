import authConfig from '@/auth.config';
import NextAuth from 'next-auth';

import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
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
    './auth.config.ts', // allows a single file
    '/auth.config.ts', // allows a single file
    './lib/models/user.model.ts', // allows a single file
    '/lib/models/user.model.ts', // allows a single file
    './node_modules/mongoose/dist/browser.umd.js', // use a glob to allow anything in the function-bind 3rd party module
    '/node_modules/mongoose/dist/browser.umd.js', // use a glob to allow anything in the function-bind 3rd party module
  ],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
