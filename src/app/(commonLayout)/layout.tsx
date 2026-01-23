"use client";



import { SessionProvider } from "next-auth/react";
import { Navbar } from "../components/shared/layout/navbar";
import Footer from "../components/shared/layout/footer";

const commonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    
        <div>
              <div className="mb-20">
                <div className="max-w-[1440px] mx-auto ">
                    <Navbar />
                </div>
            </div>

            {/* Main Content Area */}
            <main className="min-h-screen font-display max-w-[90%] mx-auto bg-(--color-warm-white)">
                {children}
            </main>

            {/* Footer Container */}
            <footer className="">
                <Footer />
            </footer>
        </div>
          
       
    );
};
export default commonLayout;