"use client";
import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Button } from "@repo/ui/button";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/userAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      router.push("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center bg-zinc-900/80 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
        <div className="p-6 lg:p-8 bg-emerald-900/20 relative hidden lg:block">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
            Join Medi Meet
          </h2>
          <p className="text-sm lg:text-base text-zinc-300 mb-8">
            Start your journey to better health by scheduling your consultancy
            with Medi Meet's Healthcare Platform.
          </p>
          <div className="relative h-[200px] lg:h-[400px]">
            <Image
              src="/placeholder.svg"
              alt="Doctor consultation illustration"
              width={400}
              height={400}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-500" />
              <span className="text-xl lg:text-2xl font-semibold text-white">
                MEDI MEET
              </span>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-zinc-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-zinc-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="john.doe@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.email}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 text-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-zinc-400">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm"
              disabled={isLoading}
              onClick={() => {
                router.push("/signin");
              }}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
