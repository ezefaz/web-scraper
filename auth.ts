import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import authConfig from "@/auth.config";

import { getUserById } from "@/data/user";
import clientPromise from "@/lib/mongodb";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
	update,
} = NextAuth({
	pages: {
		signIn: "/sign-in",
		error: "/auth/error",
	},
	callbacks: {
		// async signIn({ user, account }: { user: any; account: any }) {
		// 	if (account?.provider === "google") {
		// 		const { name, email, image } = user;
		// 		try {
		// 			await connectToDb();

		// 			const existingUser = await User.findOne({ email });

		// 			const url: any =
		// 				process.env.NODE_ENV === "production"
		// 					? "https://savemelin.vercel.app/api/user"
		// 					: "http://localhost:3000/api/user";

		// 			if (!existingUser) {
		// 				const response = await axios.post(url, {
		// 					// id,
		// 					name,
		// 					email,
		// 					image,
		// 				});

		// 				if (response) {
		// 					return user;
		// 				}
		// 			}
		// 		} catch (error: any) {
		// 			throw new Error(
		// 				`Error al crear usuario con Google: ${error.message}`
		// 			);
		// 		}
		// 	}
		// },
		// async signIn({ user }: any) {
		// 	const existingUser = await getUserById(user.id);

		// 	if (!existingUser || !existingUser.emailVerified) {
		// 		return false;
		// 	}
		// },
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
	debug: process.env.NODE_ENV === "development",
	session: { strategy: "jwt" },
	secret: process.env.NEXTAUTH_SECRET,
	...authConfig,
});
