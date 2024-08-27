import  mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DBConnection = async () => {
    try {
        const MongoDB_URL = process.env.MongoDB_URL;
        await mongoose.connect(MongoDB_URL)
        console.log("Db connection Established");
    } catch (error) {
        console.log("Error COnnecting to MongoDB = " + error);
    }

}

export {DBConnection};