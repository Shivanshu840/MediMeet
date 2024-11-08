import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/clients";
import { compare } from "bcrypt";
import { signIn } from "next-auth/react";

export const authOption = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "email", type: "text", placeholder: "johndoe@gmail.com" },
                password: { label: "password", type: "password", placeholder: "password" },
            },
            async authorize(credentials?: { username: string; password: string }) {
                if (!credentials) {
                    return null;
                }
               

                const existingUser = await prisma.user.findFirst({
                    where: { email: credentials.username },
                });
                

                if (existingUser && existingUser.password) {
                    const passwordValidation = await compare(credentials.password, existingUser.password);
                    

                    if (passwordValidation) {
                        return { id: existingUser.id, email: existingUser.email };
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

        async signIn({ user, account, profile }:any) {
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
            });
        
            if (!existingUser) {
              await prisma.user.create({
                data: {
                  email: user.email,
                  firstName: profile.given_name,  
                  lastName: profile.family_name,  
                  image: profile.picture, 
                },
              });
            }
        
            return true;  
          },

        session: ({ session, token }: any) => {
            if (session && session.user) {
                session.user.id = token.uid;
            }
            return session;
        },

        
    },

    pages:{
        signIn: '/signin'
    }


};
