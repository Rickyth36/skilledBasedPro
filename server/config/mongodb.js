import mongoose, { connect } from "mongoose";

// connect to mongodb database

const connectDB = async() => {
    mongoose.connection.on('connected',()=>console.log('Database connected'));

    await mongoose.connect(`${process.env.MONGODB_URI}/sbp`)

}

export default connectDB;