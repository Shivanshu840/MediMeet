"use client";

import { Button } from "@repo/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Calendar,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";

export default function LeftBar() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };
  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-zinc-900 flex flex-col items-center py-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:w-16`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-emerald-500"
          onClick={() => router.push("/appointment")}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <div className="space-y-4 flex-1 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white w-full"
            onClick={() => router.push("/home")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 w-full"
            onClick={() => router.push("/")}
          >
            <Home className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 w-full"
            onClick={() => router.push("./totalapp")}
          >
            <Calendar className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Calendar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 w-full"
            onClick={() => router.push("/health")}
          >
            <Heart className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Health</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 w-full"
            onClick={() => router.push("/profile")}
          >
            <Settings className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Settings</span>
          </Button>
        </div>
        <Dialog
          open={showLogoutConfirmation}
          onOpenChange={setShowLogoutConfirmation}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 mt-auto mb-4 w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2 lg:hidden">Logout</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Logout</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Are you sure you want to log out? You will be redirected to the
                sign-in page.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirmation(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmLogout}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
