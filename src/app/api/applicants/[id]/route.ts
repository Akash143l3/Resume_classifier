import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri =
  'mongodb://shiva733kumara:atk9uX7ltNsYg2wi@ac-nu1x4vs-shard-00-00.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-01.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-02.ds1ebu5.mongodb.net:27017/?replicaSet=atlas-drfqmp-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Smart-Match';

const dbName = 'smart-match';
const collectionName = 'applicants';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const client = new MongoClient(uri);

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const applicant = await collection.findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          Name: 1,
          Email: 1,
          profile: 1,
        },
      }
    );

    if (!applicant) {
      return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
    }

    // Try extracting name from multiple possible fields
    const name =
      applicant.Name ||
      (applicant.profile && applicant.profile.Name) ||
      'Unknown';

    return NextResponse.json(
      {
        id: applicant._id.toString(),
        name,
        email: applicant.email ?? '',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 500 });
  } finally {
    await client.close();
  }
}
