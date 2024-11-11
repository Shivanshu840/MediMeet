// pages/profile/index.js

import { getServerSession } from "next-auth/next"
import { authOption } from "../../lib/action"
import ProfilePage from "../../../components/profile"
import { redirect } from "next/navigation"

export default async function Profile() {
  const session = await getServerSession(authOption)

 
  if (!session) {
    redirect("/signin")
    return null
  }
 const user = session.user
  return (
    <ProfilePage
      initialUserData={{
        email: user?.email || "",
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        gender: user?.gender || '',
        birthday: user?.birthday || '',
        image: user?.image || ''
      }}
    />
  )
}
