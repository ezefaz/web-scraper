import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import authConfig from '@/auth.config';

import { getUserById } from '@/data/user';
import clientPromise from '@/lib/mongodb';
import User from '@/lib/models/user.model';
import TwoFactorConfirmation from '@/lib/models/TwoFactorConfirmation.model';
import { getAccountByUserId } from './data/account';

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
    async linkAccount({ user }) {
      try {
        const updatedUser = await User.findByIdAndUpdate(user.id, { emailVerified: new Date() }, { new: true });

        if (updatedUser) {
          console.log(`Actualizado: ${user.id}`);
        } else {
          console.log(`El Usuario con ID: ${user.id} no se encontró`);
        }
      } catch (error) {
        console.error('Error Actualizando el Usuario:', error);
      }
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
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      //   if (!twoFactorConfirmation) return false;

      //   // Delete two factor confirmation for next sign in
      //   await TwoFactorConfirmation.deleteOne({
      //     id: twoFactorConfirmation.id,
      //   });
      // }

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

      // if (session.user) {
      //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      // }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }: any) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser._id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  // debug: process.env.NODE_ENV === "development",
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
