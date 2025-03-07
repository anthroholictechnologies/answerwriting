import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { authenticate } from "./services/auth.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, update token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name ?? null;
        token.emailVerified = user.emailVerified;
        token.image = user.image ?? null;
        token.password = user.password ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session) {
        return session;
      }
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          emailVerified: token.emailVerified,
          image: token.image,
          password: token.password,
        };
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    }),
    CredentialsProvider({
      authorize: async (credentials) => {
        const data = await authenticate({
          email: credentials.email as string | undefined,
          password: credentials.password as string | undefined,
        });

        return data;
      },
    }),
  ],
});
