import { getServerSession } from "next-auth";
import { Sidebar } from "../Sidebar";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen font-display">
      <Sidebar /> 
      <div className="flex flex-1 flex-col">
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}