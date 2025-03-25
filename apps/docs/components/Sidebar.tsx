"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { MessageSquare, Home, Settings, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/doctor/signin");
  };

  return (
    <>
      <div className="hidden border-r border-slate-800 bg-slate-950 lg:block">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="mb-4 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-blue-400"
              onClick={() => router.push("/profile")}
            >
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-blue-400"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="h-6 w-6" />
              <span className="sr-only">Users</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-blue-400"
            >
              <Settings className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-red-400"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-lg bg-slate-900 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white">Confirm Logout</h2>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowLogoutConfirm(false)}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleLogout}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
