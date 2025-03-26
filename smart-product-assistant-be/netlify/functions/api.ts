import { Handler } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import productRoutes from '../../src/routes/products';
import categoryRoutes from '../../src/routes/categories';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Convert Express app to serverless function
const handler: Handler = async (event, context) => {
  const result = await serverless(app)(event, context) as { statusCode?: number; body?: string; headers?: Record<string, string> };
  return {
    statusCode: result.statusCode || 200,
    body: result.body,
    headers: result.headers
  };
};

export { handler }; 