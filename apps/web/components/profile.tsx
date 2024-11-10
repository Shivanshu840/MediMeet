'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@repo/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { User, Mail, Phone, MapPin, Cake, Users } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
    birthday: user?.birthday || '',
  })

  const toggleEditMode = () => setIsEditing(!isEditing)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleUpdate = () => {
    // Add logic to handle the update (e.g., API call to update user profile)
    toggleEditMode()
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 py-12">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="bg-zinc-900/80 border border-zinc-800">
          <CardHeader className="flex flex-col items-center space-y-4 pb-6">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center overflow-hidden border border-emerald-500/30">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-emerald-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold text-white">{user.name || 'User Name'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-sm text-emerald-400 font-medium uppercase tracking-wide">
                Contact Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Email:</span>
                  <span className="text-sm text-emerald-400">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Phone:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">{formData.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Address:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">{formData.address || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm text-emerald-400 font-medium uppercase tracking-wide">
                Basic Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Gender:</span>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span className="text-sm text-zinc-300">{formData.gender || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Cake className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">Birthday:</span>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">{formData.birthday || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </section>

            <div className="pt-4">
              {isEditing ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20"
                >
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}