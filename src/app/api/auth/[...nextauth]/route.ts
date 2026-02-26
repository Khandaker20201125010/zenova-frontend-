/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { UserRole } from "@/src/app/lib/types";

async function refreshAccessToken(token: any) {
  try {
    console.log("🔄 Refreshing access token...");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `refreshToken=${token.refreshToken}` // Try to send as cookie
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken, // Also send in body as fallback
        }),
        credentials: 'include', // Important for cookies
      }
    );

    const data = await response.json();
    console.log("📡 Refresh token response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    return {
      ...token,
      accessToken: data.data?.token || data.data?.accessToken,
      refreshToken: data.data?.refreshToken || token.refreshToken,
      accessTokenExpires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
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
          // Remove prompt: "consent" to avoid showing account selector every time
          // prompt: "consent",
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
          console.log("🔐 Authorizing credentials for:", credentials.email);
          
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              credentials: 'include', // Important for cookies
            },
          );

          const data = await res.json();
          console.log("📡 Login response:", data);

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
          console.error("❌ Authorize error:", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("📝 SignIn callback:", { 
        provider: account?.provider,
        email: user.email,
        hasAccount: !!account 
      });
      
      if (account?.provider === "google") {
        try {
          console.log("🔄 Processing Google sign-in for:", user.email);
          
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: account.providerAccountId,
                avatar: user.image,
              }),
              credentials: 'include', // Important for cookies
            },
          );

          const data = await res.json();
          console.log("📡 Social login response:", data);

          if (res.ok && data.success) {
            user.id = data.data.user.id;
            user.role = data.data.user.role as UserRole;
            user.accessToken = data.data.token;
            user.refreshToken = data.data.refreshToken;
            
            console.log("✅ Google sign-in successful, user data updated");
            return true;
          }
          console.log("❌ Google sign-in failed:", data);
          return false;
        } catch (error) {
          console.error("💥 Google signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      console.log("🔑 JWT callback:", { 
        hasUser: !!user, 
        hasAccount: !!account,
        tokenExists: !!token,
        userId: token?.id
      });
      
      // Initial sign in
      if (account && user) {
        console.log("📝 Initial sign in, creating JWT with user data");
        console.log("User data:", {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasAccessToken: !!user.accessToken,
          hasRefreshToken: !!user.refreshToken
        });
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 30 * 24 * 60 * 60 * 1000,
          error: undefined,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        console.log("✅ Token still valid, expires in:", Math.round((token.accessTokenExpires - Date.now()) / 1000 / 60), "minutes");
        return token;
      }

      // Access token has expired, try to update it
      console.log("⏰ Token expired, attempting refresh");
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      console.log("📋 Session callback:", { 
        hasToken: !!token,
        hasSession: !!session,
        tokenId: token?.id,
        tokenRole: token?.role
      });
      
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email || '';
        session.user.name = token.name || '';
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      
      console.log("✅ Session created:", {
        userId: session.user?.id,
        email: session.user?.email,
        role: session.user?.role,
        hasAccessToken: !!session.accessToken,
        hasRefreshToken: !!session.refreshToken
      });
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("↪️ Redirect callback:", { url, baseUrl });
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    // newUser: "/register" // Uncomment if you want to redirect new users to register
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Changed from 'strict' to 'lax' for better compatibility
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900,
      },
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900,
      },
    },
    nonce: {
      name: `next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  debug: true, // Set to true for debugging, false in production
  secret: process.env.NEXTAUTH_SECRET,

  // Enable logger
  logger: {
    error(code, ...message) {
      console.error('next-auth error:', code, ...message);
    },
    warn(code, ...message) {
      console.warn('next-auth warning:', code, ...message);
    },
    debug(code, ...message) {
      console.log('next-auth debug:', code, ...message);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };