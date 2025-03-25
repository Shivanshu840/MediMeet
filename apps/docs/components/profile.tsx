"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Stethoscope,
  DollarSign,
  Upload,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Input } from "@repo/ui/input";
import Textarea from "@repo/ui/textarea";
import Image from "next/image";

interface DoctorData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  spiciality: string | null;
  experience: string | null;
  education: string | null;
  fee: string | null;
  address: string | null;
  about: string | null;
  image: string | null;
}

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const response = await fetch("/api/auth/doctor/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch doctor data");
      }
      const data = await response.json();
      setDoctorData(data.doctor);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setError("Failed to load doctor data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDoctorData((prev) =>
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
      const response = await fetch("/api/auth/doctor/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setDoctorData(data.doctor);
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
    setDoctorData((prev) =>
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

  if (!doctorData) {
    return <div>No doctor data available</div>;
  }

  return (
    <div className="min-h-screen bg-[#020817] py-12">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="bg-gradient-to-bl from-blue-950 to-slate-950 border-none">
          <CardHeader className="flex flex-col items-center space-y-4 pb-6">
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center overflow-hidden border border-blue-500/30">
              {doctorData.image ? (
                <Image
                  src={doctorData.image}
                  alt={`${doctorData.firstName} ${doctorData.lastName}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-blue-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold text-white">
              Dr. {doctorData.firstName} {doctorData.lastName}
            </CardTitle>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Picture
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-sm text-blue-400 font-medium uppercase tracking-wide">
                Personal Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    First Name:
                  </span>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="firstName"
                      value={doctorData.firstName || ""}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      {doctorData.firstName}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    Last Name:
                  </span>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="lastName"
                      value={doctorData.lastName || ""}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      {doctorData.lastName}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    Email:
                  </span>
                  <span className="text-sm text-slate-400">
                    {doctorData.email}
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm text-blue-400 font-medium uppercase tracking-wide">
                Professional Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    Specialty:
                  </span>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="specialty"
                      value={doctorData.spiciality || ""}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      {doctorData.spiciality}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    Experience:
                  </span>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="experience"
                      value={doctorData.experience || ""}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      {doctorData.experience}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    Education:
                  </span>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="education"
                      value={doctorData.education || ""}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      {doctorData.education}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">
                    Fee:
                  </span>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="fee"
                      value={doctorData.fee || ""}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">
                      {doctorData.fee}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm text-blue-400 font-medium uppercase tracking-wide">
                Location
              </h2>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-200">
                  Address:
                </span>
                {isEditing ? (
                  <Input
                    type="text"
                    name="address"
                    value={doctorData.address || ""}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                ) : (
                  <span className="text-sm text-slate-400">
                    {doctorData.address}
                  </span>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm text-blue-400 font-medium uppercase tracking-wide">
                About
              </h2>
              {isEditing ? (
                <Textarea
                  name="about"
                  value={doctorData.about || ""}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border-slate-700 text-white"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-slate-400">{doctorData.about}</p>
              )}
            </section>

            <div className="pt-4">
              {isEditing ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
