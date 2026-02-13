import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isLogin: { label: "Is Login", type: "boolean" } // To differentiate login vs register
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          // Call your backend login API
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            // Return user object with token
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              avatar: data.data.user.avatar,
              accessToken: data.data.token,
              refreshToken: data.data.refreshToken,
            };
          }

          // Handle specific error messages from backend
          throw new Error(data.message || "Invalid credentials");
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      }
    })
  ],

  // Callbacks to handle JWT and Session
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // For Google OAuth, you might need to create/login user in your backend
      if (account?.provider === "google") {
        try {
          // Call your backend social login API
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: token.email,
              name: token.name,
              googleId: account.providerAccountId,
              avatar: token.picture,
            }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            token.id = data.data.user.id;
            token.role = data.data.user.role;
            token.accessToken = data.data.token;
            token.refreshToken = data.data.refreshToken;
          }
        } catch (error) {
          console.error("Google social login error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom properties to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  // Custom pages
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };