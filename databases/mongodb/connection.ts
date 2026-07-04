import mongoose from "mongoose";

export async function connectMongoDB(): Promise<void> {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/nexuscore_credentials";

  const options = {
    autoIndex: true,
    maxPoolSize: 50,
    minPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  };

  mongoose.connection.on("error", (err) =>
    console.error(`❌ MongoDB Lifecycle Exception: ${err}`),
  );
  mongoose.connection.on("connected", () =>
    console.log("🍃 MongoDB Document Store Successfully Bound."),
  );

  await mongoose.connect(uri, options);
}
