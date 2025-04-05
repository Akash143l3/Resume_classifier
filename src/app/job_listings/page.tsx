"use client";

import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import Link from "next/link";

export const jobListInitial = [
  {
    id: "1",
    name: "Akash",
    email: "Akashbr41304@gmail.com",
    role: "Team Lead",
    skills: ["Leadership", "DBMS", "Project Management"],
    experience: "6 years",
    description:
      "Handles team and database. Expert in DBMS and team coordination. Leads multiple successful tech projects.",
    badge: "Fit",
  },
  {
    id: "2",
    name: "Riya",
    email: "riya.dev@example.com",
    role: "Frontend Developer",
    skills: ["React", "TailwindCSS", "UI/UX Design"],
    experience: "3 years",
    description:
      "Frontend React developer skilled in creating responsive and accessible UIs. Strong sense of visual design.",
    badge: "Unfit",
  },
  {
    id: "3",
    name: "Rahul",
    email: "rahul.db@example.com",
    role: "Database Administrator",
    skills: ["MySQL", "MongoDB", "Data Backup", "Performance Tuning"],
    experience: "5 years",
    description:
      "Database admin with extensive experience in designing and maintaining large-scale databases.",
    badge: "Maybe Fit",
  },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("All");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [jobList] = useState(jobListInitial);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [jobRole, setJobRole] = useState("Manager");
  const [jobDescription, setJobDescription] = useState("DBMS");

  const handleCheckboxChange = (email: string) => {
    setSelectedJobs((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const filteredJobs = jobList.filter((job) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      job.name.toLowerCase().includes(lowerQuery) ||
      job.email.toLowerCase().includes(lowerQuery);
    const matchesBadge =
      badgeFilter === "All" ||
      job.badge.toLowerCase() === badgeFilter.toLowerCase();
    return matchesSearch && matchesBadge;
  });

  const selectedJobDetails = jobList.filter((job) =>
    selectedJobs.includes(job.email)
  );

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Job Details Section */}
      <div className="max-w-md space-y-6 mb-10">
        <label className="block text-xl font-semibold text-blue-800 mb-4">
          Job Details
        </label>
        <div className="flex w-full items-center gap-4">
          <div className="w-full h-auto p-4 border border-blue-300 rounded-2xl bg-blue-50 shadow-sm">
            <p className="text-base text-blue-800 mb-2">
              <span className="font-medium">Job Role :</span> {jobRole}
            </p>
            <p className="text-base text-blue-800">
              <span className="font-medium">Job Description :</span> {jobDescription}
            </p>
          </div>
          <button
            onClick={() => setShowEditDialog(true)}
            className="h-10 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 max-w-3xl mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full md:w-2/3 px-4 py-3 border text-black border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          className="w-full md:w-28 px-2 py-3 text-black border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="All">All</option>
          <option value="Fit">Fit</option>
          <option value="Unfit">Unfit</option>
          <option value="Maybe Fit">Maybe Fit</option>
        </select>
      </div>

      {/* Job Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-blue-50 p-5 rounded-2xl shadow-md border border-blue-100 space-y-2 relative"
          >
            <input
              type="checkbox"
              className="absolute top-3 left-3 w-5 h-5"
              checked={selectedJobs.includes(job.email)}
              onChange={() => handleCheckboxChange(job.email)}
            />
            <div className="flex items-center justify-between ml-6">
              <h2 className="text-lg font-semibold text-blue-700">
                Name: {job.name}
              </h2>
              <Badge
                className={`text-md rounded-xl px-2 ${
                  job.badge === "Fit"
                    ? "bg-green-100 text-green-800"
                    : job.badge === "Unfit"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {job.badge}
              </Badge>
            </div>
            <p className="text-sm text-blue-600 ml-6">Email: {job.email}</p>
            <p className="text-sm text-blue-600 ml-6">{job.description}</p>
            <div className="flex justify-end">
              <Link
                href={`/profile/${job.id}`}
                className="ml-6 inline-block mt-2 text-blue-700 hover:underline text-sm font-medium"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-gray-500 col-span-full text-center italic">
            No matching jobs found.
          </div>
        )}
      </div>

      {/* Category Page Section */}
      {selectedJobDetails.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            Category Page
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedJobDetails.map((job) => (
              <div
                key={job.id}
                className="bg-yellow-50 p-5 rounded-2xl shadow-md border border-yellow-100 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-yellow-800">
                    {job.name}
                  </h2>
                  <Badge
                    className={`text-md rounded-xl px-2 ${
                      job.badge === "Fit"
                        ? "bg-green-100 text-green-800"
                        : job.badge === "Unfit"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.badge}
                  </Badge>
                </div>
                <p className="text-sm text-yellow-700">Email: {job.email}</p>
                <p className="text-sm text-yellow-700">{job.description}</p>
                <Link
                  href={`/profile/${job.id}`}
                  className="inline-block mt-2 text-yellow-700 hover:underline text-sm font-medium"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-blue-800">Edit Job</h2>
            <input
              className="w-full border px-3 py-2 rounded-lg text-black"
              placeholder="Job Role"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
            <textarea
              className="w-full border px-3 py-2 rounded-lg text-black"
              placeholder="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditDialog(false)}
                className="px-4 py-2 text-black border rounded-lg"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  console.log("✅ Job Role:", jobRole);
                  console.log("✅ Job Description:", jobDescription);
                  setShowEditDialog(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
