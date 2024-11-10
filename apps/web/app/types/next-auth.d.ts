import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      phone: string
      address: string
      gender: string
      birthday: string
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      accessToken?: string
    }
  }
}