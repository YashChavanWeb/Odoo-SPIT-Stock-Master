import express from 'express';
import cors from 'cors';
import { connectDb } from './config/db.js';
import { logger } from './middlewares/logger.js';
import rateLimiter from './middlewares/rateLimiter.middleware.js';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

// routes
import authRouter from './auth/auth.route.js';
import userRouter from './users/user.routes.js';
import productRouter from './products/product.route.js';
import warehouseRouter from './warehouses/warehouse.routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

connectDb();

app.get('/health', async (req, res) => {
  res.status(200).json({
    message: 'Backend is running...!',
  });
});

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/warehouse', warehouseRouter);

app.listen(port, async () => {
  console.log(`Backend is running on port: ${port}`);
});
