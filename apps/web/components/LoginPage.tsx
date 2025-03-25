"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Stethoscope, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      console.error(result.error);
      setErrorMessage("Invalid username or password. Please try again.");
    } else {
      router.push("/home");
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("google", {
        callbackUrl: "/home",
        prompt: "select_account",
      });

      if (result?.error) {
        console.error(result.error);
        setErrorMessage("Failed to sign in with Google. Please try again.");
      }
      // Successful sign-in will be handled by the callbackUrl
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="text-center space-y-4 lg:order-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Medi Meet
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            Unlock Your Path to Wellness with Medi Meet's Consultancy Platform
          </p>
          <div className="relative h-[200px] md:h-[300px] w-full">
            <Image
              alt="Doctor consultation illustration"
              src="/placeholder.svg?height=300&width=400"
              width={400}
              height={300}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        <div className="bg-zinc-900/80 p-6 md:p-8 rounded-lg shadow-lg space-y-6 backdrop-blur-sm lg:order-1">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
              <span className="text-lg md:text-xl font-semibold text-white">
                MEDI MEET
              </span>
            </div>
          </div>
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-xs md:text-sm">{errorMessage}</p>
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-xs md:text-sm text-zinc-400"
                htmlFor="email"
              >
                Username or email
              </label>
              <Input
                id="email"
                placeholder="johnsmith007"
                type="text"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs md:text-sm text-zinc-400"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 text-sm md:text-base"
              />
              <Button
                type="button"
                variant="link"
                className="px-0 text-emerald-400 font-normal text-xs md:text-sm"
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm md:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">or</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full border-zinc-700 text-white hover:bg-zinc-800 text-sm md:text-base"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                fill="#34A853"
              />
            </svg>
            Sign in with Google
          </Button>
          <div className="text-center text-xs md:text-sm text-zinc-400">
            Are you new?{" "}
            <Button
              type="button"
              variant="link"
              className="text-emerald-400 font-normal"
              disabled={isLoading}
              onClick={() => {
                router.push("/signup");
              }}
            >
              Create an Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
