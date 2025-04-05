import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri =
  'mongodb://shiva733kumara:atk9uX7ltNsYg2wi@ac-nu1x4vs-shard-00-00.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-01.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-02.ds1ebu5.mongodb.net:27017/?replicaSet=atlas-drfqmp-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Smart-Match';

const dbName = 'smart-match';
const collectionName = 'applicants';

export async function GET() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Increase the limit to 300
    const applicants = await collection.find().limit(300).toArray();
    const ids = applicants.map(applicant => applicant._id.toString());

    return NextResponse.json({ ids }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
    await client.close();
  }
}