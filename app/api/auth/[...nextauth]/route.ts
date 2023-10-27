import User from '@/lib/models/user.model';
import UserModel from '@/lib/models/user.model';
import { connectToDb } from '@/lib/mongoose';
import { User as UserType } from '@/types';
import axios from 'axios';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from 'next-auth/react';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === 'google') {
        const { name, email, image } = user;
        try {
          await connectToDb();

          const existingUser = await User.findOne({ email });

          const url: any =
            process.env.NODE_ENV === 'production'
              ? 'https://savemelin.vercel.app/api/user'
              : 'http://localhost:3000/api/user';

          if (!existingUser) {
            const response = await axios.post(url, {
              name,
              email,
              image,
            });

            if (response) {
              return user;
            }
          }
        } catch (error: any) {
          throw new Error(`Error al crear usuario con Google: ${error.message}`);
        }
      }
    },
  },
});

export { handler as GET, handler as POST };
