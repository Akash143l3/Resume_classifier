import { NextRequest } from 'next/server';
import { MongoClient, ObjectId, Filter, Document } from 'mongodb';
import axios, { AxiosError } from 'axios';
import clientPromise from '@/lib/mongoClient'; // Adjust import path as needed

const dbName = 'smart-match';
const collectionName = 'applicants';

const mistralApiKey = 'CEhvjicvDtXqObEd3SgfW9ARVFaFOrRK';

interface Applicant {
  _id: string | ObjectId;
  [key: string]: any;
}

export async function POST(request: NextRequest) {

  let requestText = "";
  let requestData: any = {};

  try {
    requestText = await request.text();
    if (!requestText || requestText.trim() === "") {
      return new Response(JSON.stringify({ message: 'Empty request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      requestData = JSON.parse(requestText);
    } catch (parseError) {
      return new Response(JSON.stringify({
        message: 'Invalid JSON in request body',
        error: (parseError as Error).message,
        rawData: requestText.substring(0, 100) + (requestText.length > 100 ? '...' : '')
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { applicantId, jobDescription, selectionCriteria } = requestData;
    if (!applicantId || !jobDescription || !selectionCriteria) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const applicant = await getApplicantFromMongoDB(applicantId);
    if (!applicant) {
      return new Response(JSON.stringify({ message: 'Applicant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const analysisResult = await callMistralAPI(applicant, jobDescription, selectionCriteria);

    const { category, summary } = processAnalysisResults(analysisResult);

    return new Response(JSON.stringify({ category, summary }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const err = error as Error;
    return new Response(JSON.stringify({
      message: 'Internal Server Error',
      error: err.message,
      step: "Unknown",
      requestText: requestText ? requestText.substring(0, 100) + (requestText.length > 100 ? '...' : '') : "Not available"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// === Helper Functions ===

async function getApplicantFromMongoDB(applicantId: string): Promise<Applicant | null> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const query: Filter<Document> = { _id: new ObjectId(applicantId) };
  const applicant = await collection.findOne(query);
  return applicant as Applicant | null;
}

async function updateMongoDB(applicantId: string, category: string, summary: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const query: Filter<Document> = { _id: new ObjectId(applicantId) };
  await collection.updateOne(query, { $set: { category, summary } });
}

async function callMistralAPI(applicant: Applicant, jobDescription: string, selectionCriteria: string) {
  const prompt = `
Analyze the following job description and applicant data to determine if the candidate is a "Good Fit," "Maybe Fit," or "Not a Fit." Provide a summary of why the candidate was categorized as such.

Job Description:
${jobDescription}

Applicant Data:
${JSON.stringify(applicant)}

Selection Criteria:
${selectionCriteria}

Please categorize the candidate and provide a 3-line summary explaining why they were placed in that category.
`;

  try {
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Mistral API error:", axiosError.message);
    if (axiosError.response) {
      console.error("Response data:", axiosError.response.data);
    }
    throw new Error(`Mistral API error: ${axiosError.message}`);
  }
}

function processAnalysisResults(analysisResult: any) {
  let category = "Unknown";
  let summary = "";

  try {
    if (analysisResult?.choices?.length > 0) {
      const content = analysisResult.choices[0].message.content;
      const lines = content.split('\n').filter((line: string) => line.trim() !== '');

      if (lines.length > 0) {
        const firstLine = lines[0].trim();

        if (firstLine.includes("Good Fit") || firstLine.includes("Maybe Fit") || firstLine.includes("Not a Fit")) {
          category = firstLine;
          summary = lines.slice(1).join('\n');
        } else {
          if (content.includes("Good Fit")) category = "Good Fit";
          else if (content.includes("Maybe Fit")) category = "Maybe Fit";
          else if (content.includes("Not a Fit")) category = "Not a Fit";

          summary = content;
        }
      }
    }
  } catch (error) {
    console.error("Error processing analysis results:", error);
  }

  return { category, summary };
}