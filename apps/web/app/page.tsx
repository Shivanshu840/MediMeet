"use client"

import { useSession } from "next-auth/react";
import LandinPage from "../components/LandingPage";

export default function Home() {
  const session = useSession();
  return (
    <div>
      {/* {JSON.stringify(session)} */}
      <LandinPage/>
    </div>
  );
}
