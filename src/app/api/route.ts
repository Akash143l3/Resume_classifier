import { NextRequest } from 'next/server';
import { MongoClient, ObjectId, Filter, Document } from 'mongodb';
import axios, { AxiosError } from 'axios';

// MongoDB Connection URL
const mongoUri = 'mongodb://shiva733kumara:atk9uX7ltNsYg2wi@ac-nu1x4vs-shard-00-00.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-01.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-02.ds1ebu5.mongodb.net:27017/?replicaSet=atlas-drfqmp-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Smart-Match';
const dbName = 'smart-match';
const collectionName = 'applicants';

// Mistral AI API Key and Model
const mistralApiKey = 'CEhvjicvDtXqObEd3SgfW9ARVFaFOrRK';

// Define interfaces for better type safety
interface Applicant {
  _id: string | ObjectId;
  [key: string]: any;
}

// API Endpoint to Analyze Applicant
export async function POST(request: NextRequest) {
    console.log("==== STEP 1: Starting API request handler ====");
    
    let requestText = "";
    let requestData: any = {};
    
    // STEP 2: Parse request body
    try {
        console.log("==== STEP 2: Reading request body ====");
        requestText = await request.text();
        console.log("Raw request body:", requestText);
        
        if (!requestText || requestText.trim() === "") {
            console.log("Empty request body received");
            return new Response(JSON.stringify({ 
                message: 'Empty request body'
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        console.log("==== STEP 3: Parsing JSON ====");
        try {
            requestData = JSON.parse(requestText);
            console.log("Parsed request data:", requestData);
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return new Response(JSON.stringify({ 
                message: 'Invalid JSON in request body',
                error: (parseError as Error).message,
                rawData: requestText.substring(0, 100) + (requestText.length > 100 ? '...' : '')
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // STEP 4: Validate input fields
        console.log("==== STEP 4: Validating input fields ====");
        const { applicantId, jobDescription, selectionCriteria } = requestData;
        
        if (!applicantId) {
            console.log("Missing applicantId");
            return new Response(JSON.stringify({ message: 'Applicant ID is required' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (!jobDescription) {
            console.log("Missing jobDescription");
            return new Response(JSON.stringify({ message: 'Job description is required' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (!selectionCriteria) {
            console.log("Missing selectionCriteria");
            return new Response(JSON.stringify({ message: 'Selection criteria is required' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // STEP 5: Get applicant data from MongoDB
        console.log("==== STEP 5: Getting applicant data ====");
        const applicant = await getApplicantFromMongoDB(applicantId);
        
        if (!applicant) {
            console.log("Applicant not found:", applicantId);
            return new Response(JSON.stringify({ message: 'Applicant not found' }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        console.log("Found applicant:", applicant._id);
        
        // STEP 6: Call Mistral API
        console.log("==== STEP 6: Calling Mistral API ====");
        const analysisResult = await callMistralAPI(applicant, jobDescription, selectionCriteria);
        
        // STEP 7: Process results
        console.log("==== STEP 7: Processing results ====");
        const { category, summary } = processAnalysisResults(analysisResult);
        
        // STEP 8: Update MongoDB
        console.log("==== STEP 8: Updating MongoDB ====");
        await updateMongoDB(applicantId, category, summary);
        
        // STEP 9: Return response
        console.log("==== STEP 9: Sending response ====");
        const responseObject = { category, summary };
        console.log("Response object:", responseObject);
        
        return new Response(JSON.stringify(responseObject), {
            headers: { 'Content-Type': 'application/json' },
        });
        
    } catch (error) {
        const err = error as Error;
        console.error("==== ERROR in API handler ====", err);
        console.error("Error stack:", err.stack);
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

// Helper function to get applicant from MongoDB
async function getApplicantFromMongoDB(applicantId: string): Promise<Applicant | null> {
    console.log("Getting applicant with ID:", applicantId);
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Convert string ID to ObjectId if needed
        let query: Filter<Document> = {};
        if (ObjectId.isValid(applicantId)) {
            query = { _id: new ObjectId(applicantId) };
            console.log("Using ObjectId query:", query);
        } else {
            query = { _id: new ObjectId(applicantId) };

            console.log("Using string ID query:", query);
        }
        
        const applicant = await collection.findOne(query);
        console.log("MongoDB query result:", applicant ? "Found" : "Not found");
        return applicant as Applicant | null;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

// Helper function to call Mistral API
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

    console.log("Preparing Mistral API request");
    
    try {
        console.log("Sending request to Mistral API");
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
            model: "mistral-large-latest",
            messages: [
                { role: "user", content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${mistralApiKey}`,
                'Content-Type': 'application/json',
            }
        });

        console.log("Mistral API response status:", response.status);
        console.log("Mistral API response data type:", typeof response.data);
        
        if (!response.data) {
            console.error("Mistral API returned empty response");
            throw new Error("Empty response from Mistral API");
        }
        
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Mistral API Error:", axiosError.message);
        if (axiosError.response) {
            console.error("Response status:", axiosError.response.status);
            console.error("Response data:", axiosError.response.data);
        }
        throw new Error(`Mistral API error: ${axiosError.message}`);
    }
}

// Helper function to process analysis results
function processAnalysisResults(analysisResult: any) {
    console.log("Processing analysis results");
    
    let category = "Unknown";
    let summary = "";
    
    try {
        if (analysisResult && analysisResult.choices && analysisResult.choices.length > 0) {
            const content = analysisResult.choices[0].message.content;
            console.log("Raw content from Mistral:", content);
            
            const lines = content.split('\n').filter((line: string) => line.trim() !== '');
            
            if (lines.length > 0) {
                // First line is likely the category
                const firstLine = lines[0].trim();
                console.log("First line:", firstLine);
                
                if (firstLine.includes("Good Fit") || firstLine.includes("Maybe Fit") || firstLine.includes("Not a Fit")) {
                    category = firstLine;
                    // The rest is the summary
                    summary = lines.slice(1).join('\n');
                } else {
                    // If first line doesn't contain category, parse the whole content
                    if (content.includes("Good Fit")) {
                        category = "Good Fit";
                    } else if (content.includes("Maybe Fit")) {
                        category = "Maybe Fit";
                    } else if (content.includes("Not a Fit")) {
                        category = "Not a Fit";
                    }
                    summary = content;
                }
            }
        } else {
            console.log("Invalid analysis result structure:", analysisResult);
        }
    } catch (error) {
        console.error("Error processing analysis results:", error);
    }
    
    console.log("Extracted category:", category);
    console.log("Extracted summary:", summary?.substring(0, 50) + (summary?.length > 50 ? '...' : ''));
    
    return { category, summary };
}

// Helper function to update MongoDB
async function updateMongoDB(applicantId: string, category: string, summary: string) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        console.log("Connected to MongoDB for update");
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        let query: Filter<Document> = {};
        if (ObjectId.isValid(applicantId)) {
            query = { _id: new ObjectId(applicantId) };
        } else {
            query = { _id: new ObjectId(applicantId) };

        }
        
        console.log("Updating MongoDB with category:", category);
        const result = await collection.updateOne(query, { $set: { category, summary } });
        console.log("MongoDB update result:", result.modifiedCount > 0 ? "Success" : "No changes");
        
    } catch (err) {
        console.error("Error updating MongoDB:", err);
        throw err;
    } finally {
        await client.close();
        console.log("MongoDB connection closed after update");
    }
}