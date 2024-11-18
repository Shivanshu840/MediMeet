import NextAuth from "next-auth"

declare module "next-auth" {
  interface Doctor {
    id: string
    email: string
    name: string
    firstName: string
    lastName: string
    image?: string
    about?: string
    spiciality?: string
    education?: string
    fee?: string
  }

  interface Session {
    user: Doctor
  }
}