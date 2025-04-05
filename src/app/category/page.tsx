"use client";
import React, { useState } from "react";
import { jobListInitial } from "../job_listings/page";
import Link from "next/link";

// Types
type Candidate = {
  id: string;
  role: string;
};

type JobDetail = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  description: string;
  badge: string;
};

type EnrichedCandidate = Candidate & JobDetail;

// Base candidates list
const candidates: Candidate[] = [
  { id: "1", role: "Manager" },
  { id: "2", role: "Manager" },
  { id: "3", role: "Database Admin" },
];

export default function Page() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [enrichedCandidates, setEnrichedCandidates] = useState<EnrichedCandidate[]>(
    candidates.reduce((acc: EnrichedCandidate[], candidate) => {
      const details = jobListInitial.find((user) => user.id === candidate.id);
      if (details) {
        acc.push({ ...candidate, ...details });
      }
      return acc;
    }, [])
  );

  // Group by role
  const groupedByRole = enrichedCandidates.reduce(
    (acc: Record<string, EnrichedCandidate[]>, candidate) => {
      if (!acc[candidate.role]) acc[candidate.role] = [];
      acc[candidate.role].push(candidate);
      return acc;
    },
    {}
  );

  // Toggle checkbox
  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete selected
  const handleDeleteSelected = () => {
    const deleted = enrichedCandidates.filter(user =>
      selectedIds.includes(user.id)
    );

    console.log("🗑️ Deleted Candidates:");
    deleted.forEach((user) => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Role: ${user.role}`);
    });

    const filtered = enrichedCandidates.filter((user) => !selectedIds.includes(user.id));
    setEnrichedCandidates(filtered);
    setSelectedIds([]);
  };

  return (
    <div className="w-full min-h-screen bg-white p-6 space-y-10">
      {selectedIds.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleDeleteSelected}
            className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm"
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      )}

      {Object.entries(groupedByRole).map(([role, users]) => (
        <div key={role}>
          <h1 className="text-blue-600 text-xl font-semibold mb-6">{role}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-blue-50 flex gap-2 p-6 rounded-2xl shadow-md border border-blue-100 space-y-2 relative"
              >
                <input
                  type="checkbox"
                  className=" w-5 mt-1 h-5"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-blue-700">
                      {user.name}
                    </h2>
                  </div>
                  <p className="text-sm text-blue-600">Email: {user.email}</p>
                  <p className="text-sm text-blue-600">{user.description}</p>
                  <div className="w-full flex justify-end">
                    <Link
                      href={`/profile/${user.id}`}
                      className="ml-6 inline-block mt-2 text-blue-700 hover:underline text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
