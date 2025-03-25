"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900/40">
      <Card className="w-[350px] bg-slate-950/80 border border-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            MediMeet
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your account using Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
