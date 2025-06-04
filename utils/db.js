import mongoose from"mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect MongoDB :)");
    } catch (error) {
        console.log("Error connecting MongoDB",error)
    }
}


export default connectDB;