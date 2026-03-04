import { getServerSession } from "next-auth";
import { Sidebar } from "../Sidebar";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const headersList = await headers();
    const pathname = headersList.get("next-url") || "";

    // GLOBAL PROTECTION: Check if user is logged in
    if (!session) {
        redirect("/login");
    }

    // Role-based access control
    const userRole = session.user?.role;

    // Admin trying to access user routes
    if (userRole === "ADMIN" &&
        (pathname.startsWith("/dashboard") || pathname.startsWith("/user"))) {
        redirect("/admin");
    }

    // User trying to access admin routes
    if (userRole !== "ADMIN" && pathname.startsWith("/admin")) {
        redirect("/dashboard");
    }
    return (
        <div className="flex min-h-screen font-display">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <main className="flex-1 bg-muted/30 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto overflow-y-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>


    );
}