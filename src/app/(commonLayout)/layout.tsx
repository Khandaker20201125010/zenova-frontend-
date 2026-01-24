// app/commonLayout.tsx or wherever you have this
"use client"

import { SessionProvider } from "next-auth/react"
import { Navbar } from "../components/shared/layout/navbar"

import { ConfettiProvider } from "../components/shared/confetti-provider"
import { Footer } from "../components/shared/layout/footer"

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ConfettiProvider>
        <div>
          <div className="mb-20">
            <div className="max-w-[1440px] mx-auto">
              <Navbar />
            </div>
          </div>

          <main className="min-h-screen font-display max-w-[90%] mx-auto bg-(--color-warm-white)">
            {children}
          </main>

          <footer className="">
            <Footer />
          </footer>
        </div>
      </ConfettiProvider>
    </SessionProvider>
  )
}

export default CommonLayout