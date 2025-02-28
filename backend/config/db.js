require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            useNewUrlParser: true,
        });
        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;
