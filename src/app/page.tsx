"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/lib/store";
  
export default function Page() {
  const [showDialog, setShowDialog] = useState(false);
  const [role, setRole] = useState("Manager");
  const [description, setDescription] = useState("DBMS");
  const setJobDetails = useJobStore((state:any) => state.setJobDetails);
  const router = useRouter();

  const handleSubmit = () => {
    setJobDetails(role, description);
    router.push("/job_listings");
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6 bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          Smart Match
        </h1>
        <p className="text-lg md:text-xl text-black">
          Smart Match uses AI to compare resumes with job requirements. It classifies candidates as a{" "}
          <strong>Good Fit</strong>, <strong>Maybe Fit</strong>, or{" "}
          <strong>Not Fit</strong>.
        </p>
        <Button
          onClick={() => setShowDialog(true)}
          className="text-lg px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Enter Prompt
        </Button>

        {/* Dialog */}
        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 space-y-4 w-full max-w-md">
              <h2 className="text-xl font-semibold text-blue-700">Enter Job Details</h2>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Job Role"
                className="w-full p-2 border rounded-md text-black"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Job Description"
                className="w-full p-2 border rounded-md text-black"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
