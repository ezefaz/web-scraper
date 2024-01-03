import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import authConfig from '@/auth.config';

import { getUserById } from '@/data/user';
import clientPromise from '@/lib/mongodb';
import User from './lib/models/user.model';
import TwoFactorConfirmation from './lib/models/TwoFactorConfirmation.model';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  events: {
    async linkAccount({ user }: any) {
      await User.updateOne({
        where: { _id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }: any) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      // 	const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
      // 		existingUser.id
      // 	);

      // 	if (!twoFactorConfirmation) return false;

      // 	// Delete two factor confirmation for next sign in
      // 	await TwoFactorConfirmation.deleteOne({
      // 		where: { id: twoFactorConfirmation.id },
      // 	});
      // }

      return true;
    },

    async session({ token, session }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        // session.user.role = token.role as "ADMIN" | "USER";
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }: any) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  // debug: process.env.NODE_ENV === "development",
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
