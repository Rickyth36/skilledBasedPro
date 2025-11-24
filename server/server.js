import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';

const app = express();

app.use(cors());

// DB connection
await connectDB();

app.get('/',(req,res) => {
    res.send("API working")
})

const PORT = process.env.PORT || 5001   

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})