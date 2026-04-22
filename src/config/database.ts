import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || '');
        console.log(` Połączono z bazą Muminków: ${conn.connection.host}`);
    } catch (error) {
        console.error(' Błąd połączenia z bazą:', error);
        process.exit(1);
    }
};