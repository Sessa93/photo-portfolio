import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminRoot() {
  const session = await getSession();
  if (session.isLoggedIn) {
    redirect("/admin/dashboard");
  }
  redirect("/admin/login");
}
