import { NextAuthOptions, getServerSession } from "next-auth";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";

import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "./prisma";

export const AuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        // validate
        const userWEmail = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!userWEmail || !userWEmail.password) return null;
        const passwordCorrect = await compare(credentials?.password || "", userWEmail.password);
        if (passwordCorrect) {
          return {
            id: userWEmail.id,
            email: userWEmail.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({ where: { email: token.email } });
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbUser.id,
        email: dbUser.email,
      };
    },
  },
};
export const getAuthSession = () => getServerSession(AuthOptions);
