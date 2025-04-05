// lib/mongoClient.ts
import { MongoClient } from 'mongodb';

const uri = 'mongodb://shiva733kumara:atk9uX7ltNsYg2wi@ac-nu1x4vs-shard-00-00.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-01.ds1ebu5.mongodb.net:27017,ac-nu1x4vs-shard-00-02.ds1ebu5.mongodb.net:27017/?replicaSet=atlas-drfqmp-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Smart-Match';

declare global {
  // Extend NodeJS.Global type
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
