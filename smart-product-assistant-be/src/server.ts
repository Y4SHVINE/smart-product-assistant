import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Basic Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Smart Product Assistant API is Healthy' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 