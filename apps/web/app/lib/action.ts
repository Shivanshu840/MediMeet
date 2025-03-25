import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/clients";
import { compare } from "bcrypt";
import { User } from "next-auth";

export const authOption = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "email",
          type: "text",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials?: {
        username: string;
        password: string;
      }): Promise<User | null> {
        if (!credentials) {
          return null;
        }

        const existingUser = await prisma.user.findFirst({
          where: { email: credentials.username },
        });

        if (existingUser && existingUser.password) {
          const passwordValidation = await compare(
            credentials.password,
            existingUser.password,
          );

          if (passwordValidation) {
            return {
              id: existingUser.id,
              email: existingUser.email || "",
              name: existingUser.firstName || "",
              image: existingUser.image || "",
              gender: existingUser.gender || "",
              birthday: existingUser.dob || "",
              phone: existingUser.phone || "",
              address: existingUser.address || "",
            };
          }
        }

        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async signIn({ user, account, profile }: any) {
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            image: profile.picture,
          },
        });
      }

      user.id = dbUser.id;

      return true;
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          gender: user.gender,
          birthday: user.birthday,
          phone: user.phone,
          address: user.address,
        };
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
