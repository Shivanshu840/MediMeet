import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    image?: string
    gender?: string
    birthday?: string
    phone?: string
    address?: string
  }

  interface Session {
    user: User
  }
}