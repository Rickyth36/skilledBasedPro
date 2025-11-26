import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();

app.use(cors());
app.use(clerkMiddleware())

// DB connection
await connectDB();
await connectCloudinary();


// Routes
app.post('/clerk', express.raw({ type: "application/json" }), (req, res, next) => {
  console.log("Headers:", req.headers);
  console.log("Raw body:", req.body.toString());
  next();
}, clerkWebhooks);

app.use(express.json());
app.use('/api/educator/', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);

app.get('/',(req,res) => {
    res.send("API working")
})

const PORT = process.env.PORT || 5001   

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})

// console.log(process.env.MONGODB_URI);
// console.log(process.env.CLERK_WEBHOOK_SECRET);
