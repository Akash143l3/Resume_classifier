import { Button } from "@/components/ui/button";
import React from "react";

export default function Page() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6 bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
          Smart Match
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
          Smart Match uses AI to compare resumes with job requirements and
          selection criteria. It classifies candidates as a{" "}
          <strong>Good Fit</strong>,<strong> Maybe Fit</strong>, or{" "}
          <strong>Not Fit</strong> with a short reason for the classification.
        </p>
        <Button className="text-lg px-6 py-4">Enter Prompt</Button>
      </div>
    </div>
  );
}
