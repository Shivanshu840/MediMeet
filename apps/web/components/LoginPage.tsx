'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Stethoscope } from "lucide-react"
import { signIn } from 'next-auth/react'

export default function Component() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    
    const result = await signIn('credentials', {
      redirect: false, 
      username,
      password,
    })

    setIsLoading(false)

    if (result?.error) {
      console.error(result.error)
          
    } else {
      router.push('/') 
    }
  }

  return (
    <div className="min-h-screen bg-green-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Medi Meet</h1>
          <p className="text-muted-foreground">
           Unlock Your Path to Wellness with Medi Meet's Consultancy Platform
          </p>
          <div className="relative h-[300px] w-full">
            <img
              alt="Student studying illustration"
              src="/placeholder.svg?height=300&width=400"
              className="object-contain"
              style={{
                aspectRatio: "400/300",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-green-600" />
              <span className="text-xl font-semibold">MEDI MEET</span>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="email">
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
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground" htmlFor="password">
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                variant="link"
                className="px-0 text-green-600 font-normal text-sm"
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>
            <Button className="w-full bg-slate-800 hover:bg-slate-900" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50"
            onClick={async () => {
              setIsLoading(true); 
              const result = await signIn("google", { redirect: false });
              setIsLoading(false);
    
              if (result?.error) {
                console.error(result.error);
              } else {
                router.push('/');
              }

            }}
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
          </button>
          <div className="text-center text-sm">
            Are you new?{" "}
            <Button variant="link" className="text-green-600 font-normal" disabled={isLoading} onClick={() => {
              router.push("/signup")
            }}>
              Create an Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
