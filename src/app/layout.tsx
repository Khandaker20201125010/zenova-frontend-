// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "./lib/providers/theme-provider"
import { QueryProvider } from "./lib/providers/query-provider"
import { AuthProvider } from "./lib/providers/auth-provider"
import { ConfettiProvider } from "./components/shared/confetti-provider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SaaS Platform - Business Solutions",
  description: "Professional SaaS platform with e-commerce, blog, and dashboard features",
  keywords: ["SaaS", "E-commerce", "Business", "Dashboard", "Platform"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  publisher: "Your Company",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <ConfettiProvider>
                <div className="min-h-screen flex flex-col">
                  <main className="flex-1">
                    {children}
                  </main>
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        border: '1px solid hsl(var(--border))',
                      },
                      success: {
                        iconTheme: {
                          primary: 'hsl(var(--success))',
                          secondary: 'hsl(var(--success-foreground))',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: 'hsl(var(--error))',
                          secondary: 'hsl(var(--error-foreground))',
                        },
                      },
                    }}
                  />
                </div>
              </ConfettiProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}