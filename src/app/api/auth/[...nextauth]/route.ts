/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { UserRole } from "@/src/app/lib/types";

// Helper to extract expiration time from the backend JWT
const getJwtExpiry = (token: string) => {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (payload && payload.exp) {
      return payload.exp * 1000; // Convert to milliseconds
    }
  } catch (error) {
    console.error("Error decoding JWT:", error);
  }
  return Date.now() + 15 * 60 * 1000; // Fallback to 15 mins
};

async function refreshAccessToken(token: any) {
  try {
    console.log("🔄 Refreshing access token via NextAuth...");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to refresh token");
    }

    const newAccessToken = data.data?.token || data.data?.accessToken;
    
    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: data.data?.refreshToken || token.refreshToken,
      accessTokenExpires: getJwtExpiry(newAccessToken),
      error: undefined,
    };
  } catch (error) {
    console.error("❌ Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          
          const data = await res.json();

          if (res.ok && data.success) {
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role as UserRole,
              avatar: data.data.user.avatar || null,
              accessToken: data.data.token,
              refreshToken: data.data.refreshToken,
            };
          }
          throw new Error(data.message || "Invalid credentials");
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              avatar: user.image,
            }),
          });
          
          const data = await res.json();
          
          if (res.ok && data.success) {
            user.id = data.data.user.id;
            user.role = data.data.user.role as UserRole;
            user.accessToken = data.data.token;
            user.refreshToken = data.data.refreshToken;
            return true;
          }
          return false;
        } catch (error) {
          console.error("💥 Google signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: getJwtExpiry(user.accessToken as string),
          error: undefined,
        };
      }

      // Return previous token if the access token has not expired yet (with a 10s buffer)
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number) - 10000) {
        return token;
      }

      // Access token has expired, let NextAuth update it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email || '';
        session.user.name = token.name || '';
        session.user.role = token.role as UserRole;
        session.user.avatar = token.avatar as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error;
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };