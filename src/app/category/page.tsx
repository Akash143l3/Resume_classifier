"use client";
import React from "react";
import { Badge } from "@/components/ui/badge"; // Assuming you're using ShadCN UI Badge

const candidates = [
  {
    id: "1",
    name: "Akash",
    email: "akash@gmail.com",
    description:
      "Expert in leadership and team management. Leads successful projects with strong technical insight.",
  },
  {    
    id: "2",
    name: "Riya",
    email: "riya@gmail.com",
    description:
      "Frontend developer with strong experience in React and TailwindCSS. Great design thinking.",
  },
  {
    id: "3",
    name: "Rahul",
    email: "rahul@gmail.com",
    description:
      "Database administrator with experience in MySQL and MongoDB. Maintains large scale databases efficiently.",
  },
];

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-white p-6">
      <h1 className="text-blue-600 text-xl font-semibold mb-6">Manager</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((user) => (
          <div
            key={user.id}
            className="bg-blue-50 p-5 rounded-2xl shadow-md border border-blue-100 space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-700">
                Name: {user.name}
              </h2>
              
            </div>
            <p className="text-sm text-blue-600">Email: {user.email}</p>
            <p className="text-sm text-blue-600">{user.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
