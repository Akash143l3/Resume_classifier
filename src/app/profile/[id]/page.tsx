"use client";

import { jobListInitial } from "@/app/job_listings/page";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams();
  const user = jobListInitial.find((job) => job.id === id);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-600 text-2xl font-semibold">
        Profile Not Found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white p-10">
      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-blue-100 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-700 shadow-inner">
            {user.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-bold text-blue-800">{user.name}</h1>
           
             
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-blue-800 font-medium">{user.email}</p>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-500 mb-1">Experience</p>
            <p className="text-blue-800 font-medium">{user.experience}</p>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 col-span-1 sm:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Skills</p>
            <ul className="flex flex-wrap gap-2 mt-2">
              {user.skills.map((skill, idx) => (
                <li
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 col-span-1 sm:col-span-2">
            <p className="text-sm text-gray-500 mb-1">About</p>
            <p className="text-blue-800">{user.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
