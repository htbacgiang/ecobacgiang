import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: "user" | "admin"
      emailVerified?: boolean
      gender?: string
      phone?: string
      dateOfBirth?: string | null
      hasAddresses?: boolean
      hasWishlist?: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: "user" | "admin"
    emailVerified?: boolean
    gender?: string
    phone?: string
    dateOfBirth?: string | null
    hasAddresses?: boolean
    hasWishlist?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "user" | "admin"
    emailVerified?: boolean
  }
}
