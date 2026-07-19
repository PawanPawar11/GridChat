import mongoose from "mongoose"

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    
    if(!MONGO_URI) {
        throw new Error("Failed to resolve MONGO_URI from Environment Variables.");
    }

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "GridChat_DB"
        });
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("Error connecting to MongoDB...", error);
        process.exit(1);
    }
}

export default connectDB