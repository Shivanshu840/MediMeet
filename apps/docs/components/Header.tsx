"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@repo/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Bell, Search } from 'lucide-react'
import { useRouter } from "next/navigation"

export function Header() {
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  const userName = session?.user?.name || "Guest"
  const userImage = session?.user?.image || "/placeholder.svg"

  const handleLogout = () => {
    signOut({ callbackUrl: "/doctor/signin" })
  }

  const toggleDropdown = () => setShowDropdown((prev) => !prev)

  return (
    <>
      {/* Header Section */}
      <header className="flex h-14 items-center gap-4 border-b border-slate-800 bg-slate-950 px-6">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold text-white">
            {`Good ${
              new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 18
                ? "afternoon"
                : "evening"
            }, ${userName}`}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="relative">
            <Avatar onClick={toggleDropdown} className="cursor-pointer">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-blue-500 text-white">
                {userName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-slate-900 shadow-lg">
                <ul className="p-2">
                  <li className="mb-2">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 rounded"
                      onClick={() => router.push("/profile")}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 rounded"
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-lg bg-slate-900 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white">Confirm Logout</h2>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowLogoutConfirm(false)} className="text-slate-300 hover:text-white hover:bg-slate-800">
                Cancel
              </Button>
              <Button variant="default" onClick={handleLogout} className="bg-blue-500 text-white hover:bg-blue-600">
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}