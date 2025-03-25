import { getServerSession } from "next-auth";
import styles from "./page.module.css";
import { authOptionDoctor } from "./lib/authoption";
import { redirect } from "next/navigation";
import Dashboard from "../components/Dashboard";

export default async function Home() {
  const session = await getServerSession(authOptionDoctor);
  if (!session) {
    return redirect("/doctor/signin");
  } else {
    return redirect("/dashboard");
  }
}
