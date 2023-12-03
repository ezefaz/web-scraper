// import { getToken } from 'next-auth/jwt';
// import { NextRequest, NextResponse } from 'next/server';

// export { default } from 'next-auth/middleware';

// export async function middleware(req: NextRequest) {
//   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!session) {
//     const requestedPage = req.nextUrl.pathname;
//     const url = req.nextUrl.clone();

//     url.pathname = '/';
//     url.search = `p=${requestedPage}`;

//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = { matcher: ['/user-products'] };
import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withClerkMiddleware((req: NextRequest) => {
	return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next
		 * - static (static files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - public folder
		 */
		"/((?!static|.*\\..*|_next|favicon.ico).*)",
		"/",
	],
};
