import { getServerSession } from "next-auth/next";
import { authOption } from "../../lib/action";
import ProfilePage from "../../../components/profile";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession(authOption);

  if (!session) {
    redirect("/signin");
  }
  return <ProfilePage />;
}
