import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import { clerkMiddleware } from '@clerk/express';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';
import { clerkWebhooks, stripeWebHooks } from './controllers/webhooks.js';

const app = express();

app.use(cors());

app.use(express.json());


await connectDB();
await connectCloudinary();

app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebHooks);

app.use('/api/course', courseRouter);
app.use('/api/user',clerkMiddleware(), userRouter);
app.use('/api/educator',clerkMiddleware(), educatorRouter);
// app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('API working'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
