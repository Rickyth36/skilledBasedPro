import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

app.use(cors());

// DB connection
await connectDB();


// Routes
app.get('/',(req,res) => {
    res.send("API working")
})
app.post('/clerk', express.json(),clerkWebhooks)

const PORT = process.env.PORT || 5001   

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})