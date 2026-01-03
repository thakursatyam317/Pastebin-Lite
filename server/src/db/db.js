import mongoose  from "mongoose";


const connectDB = async()=>{
    try {
        const conn = await  mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is Connected: ${conn.connection.host}`);
        
    } catch (error) {
        throw new Error(`Error in DB connection: ${error.message}`);
    }
}

export default connectDB;