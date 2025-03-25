"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { User, Mail, Phone, MapPin, Cake, Users, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface UserData {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  dob: string | null;
  image: string | null;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/update-profile");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) =>
      prev
        ? {
            ...prev,
            [name]: value || null,
          }
        : null,
    );
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUserData(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (result: any) => {
    const imageUrl = result.info.secure_url;
    setUserData((prev) =>
      prev
        ? {
            ...prev,
            image: imageUrl,
          }
        : null,
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 py-12">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="bg-zinc-900/80 border border-zinc-800">
          <CardHeader className="flex flex-col items-center space-y-4 pb-6">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center overflow-hidden border border-emerald-500/30">
              {userData.image ? (
                <img
                  src={userData.image}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-emerald-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold text-white">
              {userData.firstName} {userData.lastName}
            </CardTitle>
            {isEditing && (
              <CldUploadWidget
                uploadPreset="all_pictures"
                onUpload={handleImageUpload}
              >
                {({ open }) => (
                  <Button
                    onClick={() => open()}
                    variant="outline"
                    size="sm"
                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-sm text-emerald-400 font-medium uppercase tracking-wide">
                Personal Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    First Name:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">
                      {userData.firstName || "Not provided"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    Last Name:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">
                      {userData.lastName || "Not provided"}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm text-emerald-400 font-medium uppercase tracking-wide">
                Contact Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    Email:
                  </span>
                  <span className="text-sm text-emerald-400">
                    {userData.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    Phone:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={userData.phone || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">
                      {userData.phone || "Not provided"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    Address:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={userData.address || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">
                      {userData.address || "Not provided"}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm text-emerald-400 font-medium uppercase tracking-wide">
                Additional Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    Gender:
                  </span>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={userData.gender || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span className="text-sm text-zinc-300">
                      {userData.gender || "Not provided"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Cake className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    Date of Birth:
                  </span>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={userData.dob || ""}
                      onChange={handleInputChange}
                      className="bg-zinc-800 border border-zinc-700 p-1 text-sm rounded text-white"
                    />
                  ) : (
                    <span className="text-sm text-zinc-300">
                      {userData.dob || "Not provided"}
                    </span>
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
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
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
  );
}
