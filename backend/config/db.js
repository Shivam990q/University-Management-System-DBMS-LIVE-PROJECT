const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@')); // Log URI with hidden credentials

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add connection timeout and retry options
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  retryWrites: true,
  retryReads: true
});

// Database connection function with retry
const connectDB = async (retries = 5) => {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    
    // Test the connection with a ping
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection verified with ping");
    
    return client.db("university-management");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      // Wait before retry with exponential backoff
      const delay = (5 - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1);
    }
    
    console.error("Failed to connect to MongoDB after multiple attempts");
    process.exit(1);
  }
};

module.exports = { connectDB, client }; 