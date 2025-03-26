import { Handler } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { prisma } from '../../src/lib/prisma';
import productRoutes from '../../src/routes/products';
import categoryRoutes from '../../src/routes/categories';

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://smart-product-assistant.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Convert Express app to serverless function
const handler: Handler = async (event, context) => {
  try {
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    const result = await serverless(app)(event, context) as { statusCode?: number; body?: string; headers?: Record<string, string> };
    
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Successfully disconnected from database');
    
    return {
      statusCode: result.statusCode || 200,
      body: result.body,
      headers: result.headers
    };
  } catch (error) {
    console.error('Serverless function error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    // Ensure we disconnect even if there's an error
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: {
          message: error.message,
          code: error.code,
          name: error.name
        }
      })
    };
  }
};

export { handler }; 