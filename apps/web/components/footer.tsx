import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { Button } from "@repo/ui/button"

export default function Footer() {
  return (
    <footer className="bg-zinc-900">
      {/* Wavy line decoration */}
      <div className="w-full h-24 overflow-hidden">
        <svg className="w-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path
            d="M0,50 C200,20 400,80 600,50 C800,20 1000,80 1200,50"
            className="stroke-[3] stroke-current fill-none"
            style={{
              stroke: "url(#gradient)",
              strokeLinecap: "round",
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#3B82F6" }} />
              <stop offset="100%" style={{ stopColor: "#10B981" }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo */}
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl text-white font-medium mb-4">Follow us</h3>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Youtube className="w-5 h-5 text-white" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Facebook className="w-5 h-5 text-white" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-xl text-white font-medium mb-4">About us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  About this site
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Contacts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Media requests
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  News network
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button variant="outline" className="bg-white text-zinc-900 hover:bg-zinc-100 border-0">
              Find a doctor
            </Button>
            <Button variant="outline" className="bg-white text-zinc-900 hover:bg-zinc-100 border-0">
              Log in
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
            <span>MediMeet 2024</span>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Read Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Health Information Policy
            </Link>
          </div>
          <div className="text-emerald-400">458 reviews</div>
        </div>
      </div>
    </footer>
  )
}