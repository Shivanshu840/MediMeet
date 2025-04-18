/* eslint-disable turbo/no-undeclared-env-vars */
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/clients";

export const authOptionDoctor = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    // eslint-disable-next-line no-unused-vars
    async signIn({ user, profile }: any) {
      let dbDoctor = await prisma.doctor.findUnique({
        where: { email: user.email },
      });

      if (!dbDoctor) {
        dbDoctor = await prisma.doctor.create({
          data: {
            email: user.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            image: profile.picture,
          },
        });
      }

      user.id = dbDoctor.id;
      user.firstName = dbDoctor.firstName;
      user.lastName = dbDoctor.lastName;

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          spiciality: user.spiciality,
          experience: user.experience,
          education: user.education,
          fee: user.fee,
          address: user.address,
          about: user.about,
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
    signIn: "/doctor/signin",
  },
};
