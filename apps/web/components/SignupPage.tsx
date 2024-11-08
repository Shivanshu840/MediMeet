'use client'

import { useState } from 'react';
import { Stethoscope } from "lucide-react";
import prisma from "@repo/db/clients";
import { useRouter } from 'next/navigation'
import CheckUser from './Present';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    console.log('Form submitted:', formData)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 bg-green-100 relative hidden md:block">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">Join Medi Meet</h2>
          <p className="text-slate-600 mb-8">
            Start your journey to better health by scheduling your consultancy with Medi Meet’s Healthcare Platform.
          </p>
          <div className="relative h-[400px]">
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Students collaborating"
              className="object-contain"
            />
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-semibold text-slate-800">MEDI MEET</span>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="firstName">
                  First Name
                </label>
                <input
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
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="lastName">
                  Last Name
                </label>
                <input
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
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <input
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
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50"
              disabled={isLoading}
              onClick={()=>{
                CheckUser(formData);
              }}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">or</span>
            </div>
          </div>
          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button className="inline-flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-700" disabled={isLoading} onClick={()=>{
                router.push("/signin")
            }}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}