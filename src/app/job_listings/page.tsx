"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useJobStore } from "@/lib/store";

export const jobListInitial = [
  {
    id: "1",
    name: "Akash",
    email: "Akashbr41304@gmail.com",
    skills: ["Leadership", "DBMS", "Project Management"],
    experience: "6 years",
    description:
      "Handles team and database. Expert in DBMS and team coordination. Leads multiple successful tech projects.",
    badge: "Fit",
  },
];

type ApplicantAnalysis = {
  applicantId: string;
  name: string;
  category: "Fit" | "Maybe Fit" | "Unfit" | "Error";
  summary: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function JobListingsPage() {
  const [data, setData] = useState<ApplicantAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("All");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [jobList] = useState(jobListInitial);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const jobRole = useJobStore((state) => state.role);
  const jobDescription = useJobStore((state) => state.description);
  const setJobDetails = useJobStore((state) => state.setJobDetails);

  useEffect(() => {
    const fetchAllApplicantsAnalysis = async () => {
      try {
        const idsRes = await fetch(`/api/applicants`);
        const idsJson = await idsRes.json();

        if (!idsRes.ok || !idsJson.ids || idsJson.ids.length === 0) {
          throw new Error("No applicant IDs found.");
        }

        const ids: string[] = idsJson.ids.slice(0, 20);
        const results: ApplicantAnalysis[] = [];

        for (let i = 0; i < ids.length; i++) {
          const applicantId = ids[i];

          try {
            const res = await fetch("/api", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                applicantId,
                jobDescription,
                selectionCriteria: jobRole,
              }),
            });

            const analysis = await res.json();

            let category = "Unfit";
            const rawCategory = (analysis?.category || "").toLowerCase();

            if (rawCategory.includes("good")) category = "Fit";
            else if (rawCategory.includes("maybe")) category = "Maybe Fit";

            // Fetch actual applicant name
            const profileRes = await fetch(`/api/applicants/${applicantId}`);
            const profile = await profileRes.json();

            results.push({
              applicantId,
              name: profile.name || applicantId,
              category: res.ok ? (category as ApplicantAnalysis["category"]) : "Error",
              summary: analysis?.summary || "No summary available",
            });
          } catch (err) {
            results.push({
              applicantId,
              name: applicantId,
              category: "Error",
              summary: (err as Error).message || "Unknown error",
            });
          }

          await delay(100);
        }

        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplicantsAnalysis();
  }, [jobRole, jobDescription]);

  const handleCheckboxChange = (id: string) => {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSaveSelected = () => {
    const selected = data.filter((job) => selectedJobs.includes(job.applicantId));
    console.log("✅ Selected Candidates:");
    selected.forEach((job) => {
      console.log(`Name: ${job.name}, Role: ${jobRole}`);
    });
    setSelectedJobs([]);
  };

  const filteredData = data.filter((job) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = job.name.toLowerCase().includes(lowerQuery);
    const matchesBadge =
      badgeFilter === "All" ||
      job.category.toLowerCase() === badgeFilter.toLowerCase();
    return matchesSearch && matchesBadge;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-blue-700 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium">Analyzing applicants...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">
        <svg
          className="w-12 h-12 mb-4 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
          />
        </svg>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm mt-1 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Job Info */}
      <div className="max-w-md space-y-6 mb-10">
        <label className="block text-xl font-semibold text-blue-800 mb-4">Job Details</label>
        <div className="flex w-full items-center gap-4">
          <div className="w-full p-4 border border-blue-300 rounded-2xl bg-blue-50 shadow-sm">
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

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full md:w-1/3 px-4 py-3 border text-black border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          className="w-full md:w-28 px-2 py-3 text-black border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="All">All</option>
          <option value="Fit">Fit</option>
          <option value="Unfit">Unfit</option>
          <option value="Maybe Fit">Maybe Fit</option>
        </select>
        {selectedJobs.length > 0 && (
          <button
            onClick={handleSaveSelected}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm"
          >
            Save Selected ({selectedJobs.length})
          </button>
        )}
      </div>

      {/* Applicant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div
            key={item.applicantId}
            className="relative bg-blue-50 p-5 rounded-2xl shadow-md border border-blue-100 space-y-2"
          >
            <input
              type="checkbox"
              className="absolute top-3 left-3 w-5 h-5"
              onChange={() => handleCheckboxChange(item.applicantId)}
              checked={selectedJobs.includes(item.applicantId)}
            />
            <div className="ml-6 mt-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-700 truncate">{item.name}</h2>
                <Badge
                  className={`text-sm rounded-xl px-4 ${
                    item.category === "Fit"
                      ? "bg-green-100 text-green-800"
                      : item.category === "Unfit"
                      ? "bg-red-100 text-red-800"
                      : item.category === "Maybe Fit"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {item.category}
                </Badge>
              </div>
              <p className="text-sm text-blue-600 mt-2 line-clamp-3">{item.summary}</p>
              <div className="text-right">
                <Link
                  href={`/profile/${item.applicantId}`}
                  className="mt-2 inline-block text-blue-700 hover:underline text-sm font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-blue-800">Edit Job</h2>
            <input
              className="w-full border px-3 py-2 rounded-lg text-black"
              placeholder="Job Role"
              value={jobRole}
              onChange={(e) => setJobDetails(e.target.value, jobDescription)}
            />
            <textarea
              className="w-full border px-3 py-2 rounded-lg text-black"
              placeholder="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDetails(jobRole, e.target.value)}
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
                onClick={() => setShowEditDialog(false)}
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
