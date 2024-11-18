'use client'

import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@repo/ui/button"
import img from '../public/doctor.jpg'

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40">
      {/* Navigation */}
      <header className="px-4 py-4">
        <nav className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:flex items-center gap-6">
              <Link className="text-zinc-200 hover:text-white transition-colors" href="#">
                About MediMeet
              </Link>
              <Link className="text-zinc-200 hover:text-white transition-colors" href="#">
                Reviews
              </Link>
            </div>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-emerald-500" />
          </div>
          
          <div className="flex items-center gap-4">
            {session ? (
              <Button 
                className="bg-white text-zinc-900 hover:bg-zinc-200" 
                onClick={() => signOut({ callbackUrl: '/signin' })}
              >
                Log out
              </Button>
            ) : (
              <Link className="text-zinc-200 hover:text-white transition-colors hidden sm:inline-block" href="/signin">
                Log in
              </Link>
            )}
            <Button className="bg-white text-zinc-900 hover:bg-zinc-200" onClick={() => router.push("https://medi-meet-docs-rho.vercel.app")}>
              Admin Panel
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="px-4 pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Decorative bubbles */}
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-blue-500/10 blur-xl" />
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-400/20" />
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-8">
                Your doctor
                <br />
                is here
              </h1>
              
              <p className="text-zinc-400 max-w-md">
              MediMeet is an innovative telemedicine platform connecting patients with top healthcare consultants for expert advice and care. Since 2024, we've been dedicated to providing accessible, high-quality medical consultations, ensuring you get the right guidance without leaving home. Whether you need advice on complex conditions, follow-up consultations, or urgent health concerns, MediMeet is here to connect you with experienced professionals across the country.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden">
                <Image
                  src={img}
                  alt="Modern clinic interior"
                  width={800}
                  height={600}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Wave animation */}
          <div className="mt-20 relative h-24">
            <svg className="w-full absolute" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path
                d="M0,50 C300,20 600,80 1200,50 L1200,100 L0,100 Z"
                className="fill-emerald-500/10"
              />
            </svg>
          </div>

          {/* Feature sections */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-lg bg-white/5">
              <h3 className="text-emerald-400 text-lg font-medium mb-2">Online consultations</h3>
              <p className="text-zinc-400">Connect with our doctors remotely for expert medical advice.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5">
              <h3 className="text-emerald-400 text-lg font-medium mb-2">New technologies</h3>
              <p className="text-zinc-400">State-of-the-art medical equipment and procedures.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5">
              <h3 className="text-emerald-400 text-lg font-medium mb-2">Health library</h3>
              <p className="text-zinc-400">Access comprehensive medical resources and information.</p>
            </div>
          </div>

          {/* Why Choose Section */}
          <section className="py-24">
            <h2 className="text-4xl md:text-5xl text-white text-center mb-16">Why choose MediMeet?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Successful treatment card */}
              <div className="group relative rounded-3xl p-8 bg-gradient-to-br from-emerald-100/20 to-blue-100/20 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-medium text-white mb-4">Successful treatment</h3>
                <p className="text-zinc-300">
                  Our experience of treating millions of patients each year prepares us to take care of the one who matters most - you.
                </p>
                <div className="absolute top-4 right-4">
                  <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
                  </svg>
                </div>
              </div>

              {/* Best experience card */}
              <div className="group relative rounded-3xl p-8 bg-zinc-900/80 backdrop-blur-sm">
                <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-blue-500/10 blur-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-blue-400/20" />
                <h3 className="text-2xl font-medium text-white mb-4">Best experience</h3>
                <p className="text-zinc-300 mb-6">
                  We employ the best specialists. Would you like to get to know our employees?
                </p>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  More info
                </Button>
              </div>

              {/* All answers card */}
              <div className="md:col-span-2 group relative rounded-3xl p-8 bg-zinc-900 backdrop-blur-sm">
                <h3 className="text-2xl font-medium text-white mb-4">All answers</h3>
                <p className="text-zinc-300 max-w-xl">
                  Count on our experts to deliver an accurate diagnosis and the right plan for you the first time.
                </p>
                <div className="absolute top-4 right-4">
                  <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}