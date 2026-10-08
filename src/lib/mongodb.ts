import { MongoClient } from "mongodb";

const options = {};
type MongoCache = { client: MongoClient | null; promise: Promise<MongoClient> | null };

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: MongoCache | undefined;
}

const cache = global.mongoCache ?? { client: null, promise: null };
global.mongoCache = cache;

export async function getMongoClient() {
  if (cache.client) return cache.client;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI environment variable");

  if (!cache.promise) {
    cache.promise = new MongoClient(uri, options).connect();
  }

  cache.client = await cache.promise;
  return cache.client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  const databaseName = process.env.MONGODB_DB ?? "mo_wedding";
  return client.db(databaseName);
}
