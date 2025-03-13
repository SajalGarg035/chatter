import mongoose from 'mongoose';


const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        
        return conn;
    }
    catch (error) {
        console.log('Error:', error);
        process.exit(1);
    }
}
export default connectdb;