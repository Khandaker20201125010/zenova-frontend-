import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Session Check
  if (!session) {
    redirect("/login");
  }

  // 2. EXCLUSIVE LOCK: If role is ADMIN, they cannot be here
  // We normalize to uppercase to match your Prisma seed
  const role = session.user?.role?.toUpperCase();

  if (role === "ADMIN") {
    console.log("🛡️ Admin attempt to enter User Zone blocked by Layout");
    redirect("/dashboard/admin");
  }

  return <>{children}</>;
}