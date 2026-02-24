import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserRole } from "@/lib/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      avatar?: string | null
      accessToken?: string
      refreshToken?: string
    } & DefaultSession["user"]
    accessToken?: string
    refreshToken?: string
    error?: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    avatar?: string | null
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    avatar?: string | null
    accessToken?: string
    refreshToken?: string
    email?: string
    name?: string
    error?: string
    accessTokenExpires?: number
  }
}