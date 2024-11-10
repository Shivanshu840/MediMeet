import { getServerSession } from "next-auth/next"
import { authOption } from "../../lib/action"
import Dashboard from "../../../components/PatientDashboard"
import { redirect} from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOption)
  if (!session) {  
    return redirect("/signin")
  }

  return <Dashboard user={session.user} />
}