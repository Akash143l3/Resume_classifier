"use client";
import React, { useState, useEffect } from 'react';

type ApplicantAnalysis = {
  applicantId: string;
  category: string;
  summary: string;
};

// ⏳ Delay helper
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const ApiResponsePage = () => {
  const [data, setData] = useState<ApplicantAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllApplicantsAnalysis = async () => {
      try {
        const idsRes = await fetch(`/api/applicants`);
        const idsJson = await idsRes.json();

        if (!idsRes.ok || !idsJson.ids || idsJson.ids.length === 0) {
          throw new Error("No applicant IDs found.");
        }

        const ids: string[] = idsJson.ids.slice(0, 20); // ⛔ Limit to 20 applicants

        const results: ApplicantAnalysis[] = [];

        for (let i = 0; i < ids.length; i++) {
          const applicantId = ids[i];
          console.log(`Analyzing applicant ${i + 1} of ${ids.length}: ${applicantId}`);

          try {
            const response = await fetch('/api', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                applicantId,
                jobDescription: 'Junior Developer',
                selectionCriteria: 'Java',
              }),
            });

            if (!response.ok) {
              results.push({
                applicantId,
                category: 'Error',
                summary: 'Failed to analyze',
              });
              continue;
            }

            const jsonData = await response.json();

            results.push({
              applicantId,
              category: jsonData?.category || 'Unknown',
              summary: jsonData?.summary || 'No summary available',
            });

          } catch (innerError) {
            results.push({
              applicantId,
              category: 'Error',
              summary: (innerError as Error).message || 'Unknown error',
            });
          }

          // 💤 Wait 2 seconds between requests
          await delay(1000);
        }

        setData(results);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplicantsAnalysis();
  }, []);

  if (loading) return <div>Loading all applicants' analysis...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="response-container p-6">
      <h1 className="text-2xl font-bold mb-4">All Applicant Analyses (First 20)</h1>
      {data.length === 0 ? (
        <div>No data available</div>
      ) : (
        <div className="grid gap-4">
          {data.map((item, index) => (
            <div key={index} className="border rounded p-4 shadow">
              <h2 className="text-lg font-bold">Applicant ID: {item.applicantId}</h2>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Summary:</strong></p>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiResponsePage;