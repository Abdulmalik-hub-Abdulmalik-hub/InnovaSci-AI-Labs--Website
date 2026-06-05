import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "innovasci-secret-key-change-in-production",
};

export const AUTHORIZED_ROLES = [
  "SUPER_ADMIN",
  "CEO",
  "CTO",
  "RESEARCH_DIRECTOR",
  "AI_ENGINEER",
  "SOFTWARE_ENGINEER",
  "DATA_SCIENTIST",
  "PRODUCT_MANAGER",
  "HR_MANAGER",
  "FINANCE_MANAGER",
  "CONTENT_MANAGER",
] as const;

export type AuthorizedRole = (typeof AUTHORIZED_ROLES)[number];

export const PROTECTED_ROLES = ["PUBLIC_VISITOR"] as const;
export type ProtectedRole = (typeof PROTECTED_ROLES)[number];

export function isAuthorized(role: string): role is AuthorizedRole {
  return AUTHORIZED_ROLES.includes(role as AuthorizedRole);
}

export function isProtected(role: string): role is ProtectedRole {
  return PROTECTED_ROLES.includes(role as ProtectedRole);
}