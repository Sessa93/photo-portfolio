import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPhotos, DbPhoto } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  let photos: DbPhoto[] = [];
  try {
    photos = await getPhotos();
  } catch (err) {
    console.error("Failed to fetch photos from DB:", err);
  }

  return (
    <DashboardClient
      initialPhotos={photos}
      username={session.username ?? "admin"}
    />
  );
}
