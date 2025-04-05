import { Button } from "@/components/ui/button";
import React from "react";

export default function Page() {
  return (
    <div className="w-full h-screen bg-white dark:bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6 bg-white dark:bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          Smart Match
        </h1>
        <p className="text-lg md:text-xl text-black">
          Smart Match uses AI to compare resumes with job requirements and
          selection criteria. It classifies candidates as a{" "}
          <strong>Good Fit</strong>, <strong>Maybe Fit</strong>, or{" "}
          <strong>Not Fit</strong> with a short reason for the classification.
        </p>
        <Button className="text-lg px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white">
          Enter Prompt
        </Button>
      </div>
    </div>
  );
}
