import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define a proper type for the global object cache
interface MongooseGlobal {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use `globalThis` and attach a typed mongoose cache to it
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseGlobal;
};

const cached: MongooseGlobal = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

export default async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  globalWithMongoose.mongoose = cached;

  return cached.conn;
}
